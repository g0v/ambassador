const fs = require('fs')
const path = require('path')
// logger
const winston = require('winston')
winston.level = 'silly'
// express
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fallback = require('express-history-api-fallback')
const axios = require('axios')
// database
const { Pool } = require('pg')
// Try to remove old `database.js` before requiring `database/index.js`
// This might be a bug in middle2
try {
  fs.unlinkSync(path.resolve(__dirname, './database.js'))
} catch (err) {
  winston.warn(err.message)
}
const db = require('./database')
// session map
const S = require('./session')
// GitHub
const GitHub = require('github-api')
// utils
const qs = require('query-string')
const delay = t => v => new Promise(resolve => setTimeout(resolve, t, v)) // duplicated
const { map } = require('ramda')
// errors
const { DatabaseError, AdminError } = require('./error')
// configs
const paths = require(path.resolve(__dirname, '../config/paths.js'))
const env = require('./env.js')

// service status
const status = {
  database: false
}

const logs = {}
const logId = (date, index) => date + '#' + index

const civicHashtags = [
  '開放政府',
  '開放資料',
  '社會參與',
  '新媒體應用',
  '政策共筆',
  'g0v基礎建設'
]

const createHashtagsFromList = (pool, names) => {
  const [name, ...rest] = names

  if (name === undefined) return

  winston.verbose(`Check #${name}`)

  return db.hashtag.test(pool, name)
    .then(exists => {
      if (exists) return createHashtagsFromList(pool, rest)

      winston.verbose(`Create hashtag #${name}`)

      return db.hashtag.create(pool, name)
        .then(tag => {
          winston.info(`Repo hashtag #${tag.content} is created`)

          return createHashtagsFromList(pool, rest)
        })
    })
}

const prepareRepoHashtags = (pool, org) =>
  org.getRepos()
    .then(res => res.data)
    .then(map(rs => rs.full_name))
    .then(names => createHashtagsFromList(pool, names))

const connectionString = env.DATABASE_URL
const pool = new Pool({ connectionString })
// Azure instance sleeps after 5 mins, so we poke the database every 4.5 mins
const keepAwake = () =>
  db.test(pool)
    .then(delay(2700000)) // 270s, 4.5mins
    .then(keepAwake)
db.test(pool)
  .then(now => {
    winston.verbose(`Database connected at ${now}`)

    return db.prepare(pool)
      .then(() => db.config.get(pool, 'access token'))
      .then(({ value }) => {
        let token = value

        winston.verbose('Tables are ready')
        winston.verbose(token ? `The access token is ${token}` : 'Admin token not found')
        if (!token) token = undefined

        const gh = new GitHub({ token })
        // TODO: use env.GH_ORGANIZATION
        const org = gh.getOrganization('g0v')

        winston.verbose('Prepare repo hashtags')
        const ps = [
          prepareRepoHashtags(pool, org),
          createHashtagsFromList(pool, civicHashtags)
        ]

        return Promise.all(ps)
          .then(() => {
            winston.verbose('Repo hashtags are ready')

            status.database = true
          })
      })
  })
  .then(keepAwake)
  .catch(winston.error)

// variables
const client_id = env.GH_BASIC_CLIENT_ID
const client_secret = env.GH_BASIC_CLIENT_SECRET

const app = express()
app
  .use(cors())
  .use(bodyParser.json())
  // Handle errors
  .use((err, req, res, next) => {
    winston.error(err.stack)
    res.status(500).send()
  })
  // GitHub OAuth
  .get('/api/auth', (req, res) => {
    winston.verbose('Redirect to GitHub login page')
    const endpoint = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${client_id}`
    res.redirect(303, endpoint)
  })
  // GitHub OAuth callback URL
  .get('/api/callback', (req, res, next) => {
    const { code } = req.query
    if (!code) throw new Error('OAuth code is missing')

    winston.verbose(`Exchange access token with code: ${code}`)

    axios({
      method: 'post',
      url: 'https://github.com/login/oauth/access_token',
      data: { client_id, client_secret, code }
    })
      .then((result) => {
        if (result.data.error) throw new Error(result.data.error)

        const o = qs.parse(result.data)
        winston.verbose(`Access token: ${o.access_token}`)
        S.create(o.access_token)
          .then((s) => winston.verbose('Current session:', s))

        const endpoint = `/callback?${result.data}`
        res.redirect(303, endpoint)
      })
      .catch(next)
  })
  // API status
  .get('/api/status', (req, res, next) => {
    res.json(status)
  })
  // Setup the admin token for GitHub API
  .put('/api/config/token', (req, res, next) => {
    if (!status.database) throw new DatabaseError()

    const { email, token } = req.body

    if (email !== env.ADMIN_EMAIL) {
      const err = new AdminError(email)
      winston.error(err)
      return res.status(403).send(err.message)
    }

    winston.verbose(`Set the admin token to ${token}`)
    db.config.get(pool, 'access token')
      .then(({ value }) => {
        // XXX
        if (value) {
          return db.config.update(pool, 'access token', token)
            .then(({ value }) => {
              winston.info(`The admin token is updated to ${value}`)

              res.status(200).send()
            })
        } else {
          return db.config.create(pool, 'access token', token)
            .then(({ value }) => {
              winston.info(`The admin token is set to ${value}`)

              res.status(200).send()
            })
        }
      })
  })
  .get('/api/database/export', (req, res, next) => {
    if (!status.database) throw new DatabaseError()

    winston.verbose('Export the database')

    Promise.all([
      db.hashtag.list(pool),
      db.log.list(pool),
      db.logHashtag.list(pool)
    ])
      .then(([hashtag, log, logHashtag]) => {
        winston.info('Database exported')

        res.json({ hashtag, log, logHashtag })
      })
      .catch(next)
  })
  // Get all hashtags
  .get('/api/hashtag', (req, res, next) => {
    if (!status.database) throw new DatabaseError()

    winston.verbose('Get all hasttags')

    db.hashtag.list(pool)
      .then(tags => res.json(tags))
      .catch(next)
  })
  // Get a hashtag
  .get('/api/hashtag/:tag', (req, res, next) => {
    if (!status.database) throw new DatabaseError()

    const { tag } = req.params

    winston.verbose(`Get hashtag #${tag}`)

    db.hashtag.get(pool, tag)
      .then(tag => {
        if (tag === undefined) return res.status(404).send()

        res.json(tag)
      })
      .catch(next)
  })
  // Create new hashtag
  .post('/api/hashtag/:tag', (req, res, next) => {
    if (!status.database) throw new DatabaseError()

    const { tag } = req.params

    winston.verbose(`Check hashtag #${tag}`)

    db.hashtag.test(pool, tag)
      .then(exists => {
        if (exists) return res.status(409).send('Hashtag Exists')

        winston.verbose(`Create hashtag #${tag}`)

        return db.hashtag.create(pool, tag)
          .then(tag => {
            winston.info(`Hashtag #${tag.content} created`)

            res.json(tag)
          })
      })
      .catch(next)
  })
  // Get logs
  .get('/api/hashtag/:tag/log', (req, res, next) => {
    if (!status.database) throw new DatabaseError()

    const { tag } = req.params

    winston.verbose(`Get logs by #${tag}`)

    db.logHashtag.getLogs(pool, tag)
      .then(logs => {
        winston.info(`Get ${logs.length} logs by #${tag}`)

        res.json(logs)
      })
      .catch(next)
  })
  // Get a log
  .get('/api/logbot/:channel/:date/:index', (req, res, next) => {
    if (!status.database) throw new DatabaseError()

    const { date, index, channel } = req.params
    const id = logId(date, index)

    if (!logs[id]) {
      const url = `${env.LOGBOT_URL}/channel/${channel}/${date}/json`
      winston.verbose(`Fetch logs from ${url}`)
      logs[id] = axios.get(url).then((result) => result.data || {})
    }

    logs[id]
      .then(ls => {
        const log = ls[index]

        if (log === undefined) return res.status(404).send()

        winston.verbose(`Get log ${id}`)

        return db.log.get(pool, date, +index)
          .then(l => {
            if (l === undefined) return res.json(log)

            res.json(Object.assign({}, l, log))
          })
      })
      .catch(next)
  })
  // Create log entry so we can link it with hashtags later
  .post('/api/logbot/:channel/:date/:index', (req, res, next) => {
    if (!status.database) throw new DatabaseError()

    const { date, index } = req.params

    winston.verbose(`Check log ${date}#${index}`)

    db.log.test(pool, date, +index)
      .then(exists => {
        if (exists) return res.status(409).send('Log Exists')

        winston.verbose(`Create log ${date}#${index}`)

        return db.log.create(pool, date, +index)
          .then(log => {
            winston.info(`Log ${log.date}#${log.index} created`)

            res.json(log)
          })
      })
      .catch(next)
  })
  // Link a log with a hashtag
  .post('/api/log/:log/hashtag/:hashtag', (req, res, next) => {
    if (!status.database) throw new DatabaseError()

    const { log, hashtag } = req.params

    winston.verbose(`Link log ${log} with hashtag ${hashtag}`)

    db.logHashtag.link(pool, +log, +hashtag)
      .then(link => {
        winston.info(`Log ${link.log} is linked with hashtag ${link.hashtag}`)

        res.json(link)
      })
      .catch(next)
  })
  .delete('/api/log/:log/hashtag/:hashtag', (req, res, next) => {
    if (!status.database) throw new DatabaseError()

    const { log, hashtag } = req.params

    winston.verbose(`Unlink log ${log} with hashtag ${hashtag}`)

    db.logHashtag.unlink(pool, +log, +hashtag)
      .then(link => {
        winston.info(`Log ${link.log} is unlinked with hashtag ${link.hashtag}`)

        res.json(link)
      })
      .catch(next)
  })
  // Get search hints
  .get('/api/hint', (req, res, next) => {
    const { q = '' } = req.query

    winston.verbose(`Search hint "${q}"`)

    if (q) {
      db.keyword.hint(pool, q)
        .then(hints => {
          winston.info(`Search hint "${q}":`, hints)

          res.json(hints)
        })
        .catch(next)
    } else {
      res.status(400).send()
    }
  })
  // Get resources
  .get('/api/resource', (req, res, next) => {
    winston.verbose('Get resources')

    db.resource.list(pool)
      .then(resources => {
        winston.info('Get ' + resources.length + ' resources')

        res.json(resources)
      })
      .catch(next)
  })
  .post('/api/resource', (req, res, next) => {
    const { hashtags = [] } = req.body
    let { uri } = req.body
    // TODO: guard the URI here

    if (!/^https?:\/\//.test(uri)) uri = 'http://' + uri
    winston.verbose('Create a resource with URI: ' + uri + ' and hashtags: ' + hashtags)

    db.resource.test(pool, uri)
      .then(exists => {
        if (exists) return res.status(409).send('Resource Exists')

        db.resource.create(pool, uri)
          .then(resource =>
            db.resourceHashtag.linkAll(pool, resource.id, hashtags)
              .then(hashtags => {
                winston.info('Resource ' + resource.id + ' created with URI: ' + resource.uri + ' and hashtags: ' + hashtags)

                resource.hashtags = hashtags

                res.json(resource)
              })
          )
          .catch(next)
      })
  })
  // Get a resource
  .get('/api/resource/:id', (req, res, next) => {
    if (!status.database) throw new DatabaseError()

    const { id } = req.params

    winston.verbose(`Get resource ${id}`)

    db.resource.get(pool, +id)
      .then(r => {
        if (r === undefined) return res.status(404).send()

        res.json(r)
      })
      .catch(next)
  })
  // Search keywords
  .get('/api/search', (req, res, next) => {
    const { q = '' } = req.query
    const limit = +req.query.limit || 10
    const offset = +req.query.offset || 0

    winston.verbose(`Search "${q}" with limit ${limit}, offset ${offset}`)

    // TODO: spaces as AND operators

    if (q) {
      db.keyword.get(pool, q, { limit, offset })
        .then(r => {
          winston.info(`Search "${q}", found ${r.total} logs`)

          res.json(r)
        })
        .catch(next)
    } else {
      res.status(400).send()
    }
  })
  // Proxy g0v.json@GitHub
  .get('/api/github/:name/:repo/g0v.json', (req, res, next) => {
    const { name, repo } = req.params

    winston.verbose(`Fetch https://github.com/${name}/${repo}/master/g0v.json`)

    axios.get(`https://raw.githubusercontent.com/${name}/${repo}/master/g0v.json`)
      .then(({ data }) => {
        winston.info(`https://github.com/${name}/${repo}/master/g0v.json fetched`)

        res.json(data)
      })
      .catch(error => {
        console.error(error)

        res.status(404).send()
      })
  })
  // Serve client scripts
  .use(express.static(paths.appBuild))
  // Fallback to index page as the client is a single page application
  .use(fallback('index.html', { root: paths.appBuild }))
  .listen(env.API_PORT, function() {
    winston.info(`Running at ${env.PROTOCOL}://${env.API_HOST}:${env.API_PORT}`)
  })

