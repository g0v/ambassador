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
const db = require('./database')
// GitHub
const GitHub = require('github-api')
// utils
const { map } = require('ramda')
// config
const paths = require(path.resolve(__dirname, '../config/paths.js'))

// service status
const status = {
  database: false
}

const logs = {}
const logId = (date, index) => date + '#' + index

const createRepoHashtags = (pool, org, names) => {
  const [name, ...rest] = names

  if (name === undefined) return

  winston.verbose(`Check #${name}`)

  return db.testHashtag(pool, name)
    .then((r) => {
      if (r.rows[0].exists) return createRepoHashtags(pool, org, rest)

      winston.verbose(`Create hashtag #${name}`)

      return db.createHashtag(pool, name)
        .then(r => {
          winston.info(`Repo hashtag #${name} is created`)

          return createRepoHashtags(pool, org, rest)
        })
    })
}

const prepareRepoHashtags = (pool, org) =>
  org.getRepos()
    .then(res => res.data)
    .then(map(rs => rs.full_name))
    .then(names => createRepoHashtags(pool, org, names))

const connectionString = process.env.DATABASE_URL || ''
const pool = new Pool({ connectionString })
db.test(pool)
  .then(now => {
    winston.verbose(`Database connected at ${now}`)

    return db.prepareTables(pool)
      .then(() => {
        winston.verbose('Tables are ready')

        const gh = new GitHub()
        // TODO: use process.env.GH_ORGANIZATION
        const org = gh.getOrganization('g0v')

        winston.verbose('Prepare repo hashtags')

        return prepareRepoHashtags(pool, org)
          .then(() => {
            winston.verbose('Repo hashtags are ready')

            status.database = true
          })
      })
  })
  .catch(winston.error)

// variables
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
const host = process.env.API_HOST || 'localhost'
const port = process.env.API_PORT || 80
const client_id = process.env.GH_BASIC_CLIENT_ID
const client_secret = process.env.GH_BASIC_CLIENT_SECRET

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
    if (!client_id || !client_secret) {
      throw new Error('Client ID or secret is not set')
    }

    winston.verbose('Redirect to GitHub login page')
    const endpoint = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${client_id}`
    res.redirect(303, endpoint)
  })
  // GitHub OAuth callback URL
  .get('/api/callback', (req, res, next) => {
    if (!client_id || !client_secret) throw new Error('Client ID or secret is not set')

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

        winston.verbose(`Access token: ${result.data.access_token}`)
        const endpoint = `/callback?${result.data}`
        res.redirect(303, endpoint)
      })
      .catch(next)
  })
  // API status
  .get('/api/status', (req, res, next) => {
    res.json(status)
  })
  // Get all hashtags
  .get('/api/hashtag', (req, res, next) => {
    if (!status.database) throw new Error("Database isn't ready")

    winston.verbose('Get all hasttags')

    db.listHashtag(pool)
      .then(r => res.json(r.rows))
      .catch(next)
  })
  // Get a hashtag
  .get('/api/hashtag/:tag', (req, res, next) => {
    if (!status.database) throw new Error("Database isn't ready")

    const { tag } = req.params

    winston.verbose(`Get hashtag #${tag}`)

    db.getHashtag(pool, tag)
      .then(r => {
        if (r.rows.length === 0) return res.status(404).send()

        res.json(r.rows[0])
      })
      .catch(next)
  })
  // Create new hashtag
  .post('/api/hashtag/:tag', (req, res, next) => {
    if (!status.database) throw new Error("Database isn't ready")

    const { tag } = req.params

    winston.verbose(`Check hashtag #${tag}`)

    db.testHashtag(pool, tag)
      .then(r => {
        if (r.rows[0].exists) return res.status(409).send('Hashtag Exists')

        winston.verbose(`Create hashtag #${tag}`)

        return db.createHashtag(pool, tag)
          .then(r => {
            winston.info(`Hashtag #${tag} created`)

            res.json({ id: r.rows[0].id })
          })
      })
      .catch(next)
  })
  // Get a log
  .get('/api/logbot/:channel/:date/:index', (req, res, next) => {
    if (!status.database) throw new Error("Database isn't ready")

    const { date, index, channel } = req.params
    const id = logId(date, index)

    if (!logs[id]) {
      const url = `${process.env.LOGBOT_URL}/channel/${channel}/${date}/json`
      winston.verbose(`Fetch logs from ${url}`)
      logs[id] = axios.get(url).then((result) => result.data || {})
    }

    logs[id]
      .then(ls => {
        const log = ls[index]

        if (log === undefined) return res.status(404).send()

        winston.verbose(`Get log ${id}`)

        return db.getLog(pool, date, +index)
          .then(r => {
            if (r.rows.length === 0) return res.json(log)

            res.json(Object.assign({}, r.rows[0], log))
          })
      })
      .catch(next)
  })
  // Create log entry so we can link it with hashtags later
  .post('/api/logbot/:channel/:date/:index', (req, res, next) => {
    if (!status.database) throw new Error("Database isn't ready")

    const { date, index } = req.params

    winston.verbose(`Check log ${date}#${index}`)

    db.testLog(pool, date, +index)
      .then(r => {
        if (r.rows[0].exists) return res.status(409).send('Log Exists')

        winston.verbose(`Create log ${date}#${index}`)

        return db.createLog(pool, date, +index)
          .then(r => {
            winston.info(`Log ${date}#${index} created`)

            res.json({ id: r.rows[0].id })
          })
      })
      .catch(next)
  })
  // Link a log with a hashtag
  .post('/api/log/:log/hashtag/:hashtag', (req, res, next) => {
    if (!status.database) throw new Error("Database isn't ready")

    const { log, hashtag } = req.params

    winston.verbose(`Link log ${log} with hashtag ${hashtag}`)

    db.linkLogWithHashtag(pool, +log, +hashtag)
      .then(r => {
        winston.info(`Log ${log} is linked with hashtag ${hashtag}`)

        res.json({ id: r.rows[0].id, log: +log, hashtag })
      })
      .catch(next)
  })
  .delete('/api/log/:log/hashtag/:hashtag', (req, res, next) => {
    if (!status.database) throw new Error("Database isn't ready")

    const { log, hashtag } = req.params

    winston.verbose(`Unlink log ${log} with hashtag ${hashtag}`)

    db.unlinkLogWithHashtag(pool, +log, +hashtag)
      .then(r => {
        winston.info(`Log ${log} is unlinked with hashtag ${hashtag}`)

        res.json({ id: r.rows[0].id, log: +log, hashtag })
      })
      .catch(next)
  })
  // Serve client scripts
  .use(express.static(paths.appBuild))
  // Fallback to index page as the client is a single page application
  .use(fallback('index.html', { root: paths.appBuild }))
  .listen(port, function() {
    winston.info(`Running at ${protocol}://${host}:${port}`)
  })

