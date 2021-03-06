import fs from 'fs-extra'
import path from 'path'
// logger
import winston from 'winston'
// express
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import fallback from 'express-history-api-fallback'
import axios from 'axios'
// session map
import S from './session'
// activities
import A from './activity'
// utils
import moment from 'moment'
import qs from 'query-string'
import { delay } from '../src/types/time'
import { map } from 'ramda'
// errors
import { DatabaseError, AdminError } from './error'
// configs
import paths from '../config/paths.js'
import env from './env.js'
import repos from '../data/repos.json'
import groupV1 from '../data/group/v1.json'
import groupV2 from '../data/group/v2.json'

// database
// Try to remove old `database.js` before requiring `database/index.js`.
// This might be a bug of middle2.
try {
  fs.unlinkSync(path.resolve(__dirname, './database.js'))
} catch (err) {
  winston.warn(err.message)
}
// Can't import from here, fallback to require
const { Pool } = require('pg')
const db = require('./database')

winston.level = 'silly'

// service status
const status = {
  database: false,
  taggedLogCount: 0,
  taggedResourceCount: 0
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

const createHashtagsFromList = async (pool, names) => {
  const [name, ...rest] = names

  if (!name) return

  winston.verbose(`Check #${name}`)

  const exists = await db.hashtag.test(pool, name)
  if (!exists) {
    winston.verbose(`Create hashtag #${name}`)
    const tag = await db.hashtag.create(pool, name)
    winston.info(`Hashtag #${tag.content} is created`)
  }

  return createHashtagsFromList(pool, rest)
}

const connectionString = env.DATABASE_URL
const pool = new Pool({ connectionString })
// Azure instance sleeps after 5 mins, so we poke the database every 4.5 mins
const keepAwake = () =>
  db.test(pool)
    .then(delay(2700000)) // 270s, 4.5mins
    .then(keepAwake)
db.test(pool)
  .then(async now => {
    winston.verbose(`Database connected at ${now}`)

    await db.prepare(pool)
    let { value: token } = await db.config.get(pool, 'access token')

    winston.verbose('Tables are ready')
    winston.verbose(token ? `The access token is ${token}` : 'Admin token not found')

    winston.verbose('Prepare repo hashtags')
    // start them parallelly
    const p0 = createHashtagsFromList(pool, repos)
    const p1 = createHashtagsFromList(pool, civicHashtags)
    await p0, await p1

    winston.verbose('Repo hashtags are ready')
    status.database = true
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
  .get('/api/callback', async (req, res, next) => {
    const { code } = req.query
    if (!code) throw new Error('OAuth code is missing')

    winston.verbose(`Exchange access token with code: ${code}`)

    try {
      const result = await axios({
        method: 'post',
        url: 'https://github.com/login/oauth/access_token',
        data: { client_id, client_secret, code }
      })

      if (result.data.error) throw new Error(result.data.error)

      const o = qs.parse(result.data)
      winston.verbose(`Access token: ${o.access_token}`)
      S.create(o.access_token)
        .then((s) => winston.verbose('Current session:', s))

      const endpoint = `/callback?${result.data}`
      res.redirect(303, endpoint)
    } catch (err) {
      next(err)
    }
  })
  // API status
  .get('/api/status', (req, res, next) => {
    res.json(status)
  })
  .get('/api/statistics', async (req, res, next) => {
    if (!status.database) throw new DatabaseError()

    winston.verbose('Get statistics')

    try {
      const taggedLogs = await db.logHashtag.getLogCount(pool)
      const taggedResources = await db.resourceHashtag.getResourceCount(pool)

      winston.info(`Tagged logs: ${taggedLogs}`)
      winston.info(`Tagged resources: ${taggedResources}`)

      res.json({ taggedLogs, taggedResources })
    } catch (err) {
      next(err)
    }
  })
  // Setup the admin token for GitHub API
  .put('/api/config/token', async (req, res, next) => {
    if (!status.database) throw new DatabaseError()

    const { token } = req.body

    let email
    let login
    try {
      ({ email, login } = await S.query(token))
    } catch (err) {
      winston.error(err)
      return res.status(500).send()
    }

    if (email !== env.ADMIN_EMAIL) {
      const err = new AdminError(email)
      winston.error(err)
      return res.status(403).send(err.message)
    }

    try {
      winston.verbose(`New admin token is ${token}`)
      const { value } = await db.config.get(pool, 'access token')
      winston.verbose(`Current admin token is ${value}`)

      if (value) {
        const { value } = await db.config.update(pool, 'access token', token)
        winston.info(`The admin token is updated to ${value}`)

        // log this activity
        db.activity.createFromEntry(
          pool,
          A.toEntry(A.TokenUpdate(email, login, +moment(), token))
        ).catch(next)
      } else {
        const { value } = db.config.create(pool, 'access token', token)
        winston.info(`The admin token is set to ${value}`)

        // log this activity
        db.activity.createFromEntry(
          pool,
          A.toEntry(A.TokenSet(email, login, +moment(), token))
        ).catch(next)
      }

      res.status(200).send()
    } catch (err) {
      next(err)
    }
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
  .post('/api/hashtag/:tag', async (req, res, next) => {
    if (!status.database) throw new DatabaseError()

    const { tag } = req.params
    const { token } = req.body

    let email
    let login
    try {
      ({ email, login } = await S.query(token))
    } catch (err) {
      winston.error(err)
      return res.status(500).send()
    }

    winston.verbose(`Check hashtag #${tag}`)

    db.hashtag.test(pool, tag)
      .then(exists => {
        if (exists) return res.status(409).send('Hashtag Exists')

        winston.verbose(`Create hashtag #${tag}`)

        return db.hashtag.create(pool, tag)
          .then(tag => {
            winston.info(`Hashtag #${tag.content} created`)

            // log this activity
            db.activity.createFromEntry(
              pool,
              A.toEntry(A.HashtagCreate(email, login, +moment(), tag))
            ).catch(next)

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
  .post('/api/logbot/:channel/:date/:index', async (req, res, next) => {
    if (!status.database) throw new DatabaseError()

    const { date, index } = req.params
    const { token } = req.body

    let email
    let login
    try {
      ({ email, login } = await S.query(token))
    } catch (err) {
      winston.error(err)
      return res.status(500).send()
    }

    winston.verbose(`Check log ${date}#${index}`)

    db.log.test(pool, date, +index)
      .then(exists => {
        if (exists) return res.status(409).send('Log Exists')

        winston.verbose(`Create log ${date}#${index}`)

        return db.log.create(pool, date, +index)
          .then(log => {
            winston.info(`Log ${log.date}#${log.index} created`)

            // log this activity
            db.activity.createFromEntry(
              pool,
              A.toEntry(A.LogCreate(email, login, +moment(), date, index))
            ).catch(next)

            res.json(log)
          })
      })
      .catch(next)
  })
  // Link a log with a hashtag
  .post('/api/log/:log/hashtag/:hashtag', async (req, res, next) => {
    if (!status.database) throw new DatabaseError()

    const { log, hashtag } = req.params
    const { token } = req.body

    let email
    let login
    try {
      ({ email, login } = await S.query(token))
    } catch (err) {
      winston.error(err)
      return res.status(500).send()
    }

    winston.verbose(`Link log ${log} with hashtag ${hashtag}`)

    db.logHashtag.link(pool, +log, +hashtag)
      .then(link => {
        winston.info(`Log ${link.log} is linked with hashtag ${link.hashtag}`)

        // log this activity here
        db.log.getById(pool, +log)
          .then(({ date, index }) =>
            db.hashtag.getById(pool, +hashtag)
              .then(({ content }) =>
                db.activity.createFromEntry(
                  pool,
                  A.toEntry(A.Link(email, login, +moment(), date, index, content))
                )
              )
          )
          .catch(next)

        res.json(link)
      })
      .catch(next)
  })
  .delete('/api/log/:log/hashtag/:hashtag', async (req, res, next) => {
    if (!status.database) throw new DatabaseError()

    const { log, hashtag } = req.params
    // One can use the data config field in axios.delete to set the request body.
    const { token } = req.body

    let email
    let login
    try {
      ({ email, login } = await S.query(token))
    } catch (err) {
      winston.error(err)
      return res.status(500).send()
    }

    winston.verbose(`Unlink log ${log} with hashtag ${hashtag}`)

    db.logHashtag.unlink(pool, +log, +hashtag)
      .then(link => {
        winston.info(`Log ${link.log} is unlinked with hashtag ${link.hashtag}`)

        // log this activity here
        db.log.getById(pool, +log)
          .then(({ date, index }) =>
            db.hashtag.getById(pool, +hashtag)
              .then(({ content }) =>
                db.activity.createFromEntry(
                  pool,
                  A.toEntry(A.Unlink(email, login, +moment(), date, index, content))
                )
              )
          )
          .catch(next)

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
  .post('/api/resource', async (req, res, next) => {
    const { token, hashtags = [] } = req.body

    let email
    let login
    try {
      ({ email, login } = await S.query(token))
    } catch (err) {
      winston.error(err)
      return res.status(500).send()
    }

    let { uri } = req.body
    // TODO: guard the URI here

    if (!/^https?:\/\//.test(uri)) uri = 'http://' + uri
    winston.verbose('Create a resource with URI: ' + uri + ' and hashtags: ' + hashtags)

    db.resource.test(pool, uri)
      .then(exists => {
        if (exists) return res.status(409).send('Resource Exists')

        return db.resource.create(pool, uri)
          .then(resource =>
            db.resourceHashtag.linkAll(pool, resource.id, hashtags)
              .then(ids => {
                winston.info('Resource ' + resource.id + ' created with URI: ' + resource.uri + ' and hashtags: ' + hashtags)

                // log this activity with hashtag contents instead of ids
                db.hashtag.getByIds(pool, ids)
                  .then(map(h => h.content))
                  .then(hashtags =>
                    db.activity.createFromEntry(
                      pool,
                      A.toEntry(A.ResourceCreate(
                        email,
                        login,
                        +moment(),
                        uri,
                        hashtags
                      ))
                    )
                  )
                  .catch(next)

                resource.hashtags = hashtags

                res.json(resource)
              })
          )
      })
      .catch(next)
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
  .get('/api/activity', async (req, res, next) => {
    if (!status.database) throw new DatabaseError()

    winston.verbose('Get activities')

    try {
      let acts = await db.activity.list(pool)
      acts = map(A.fromEntry, acts)
      res.json(acts)
    } catch (error) {
      next(error)
    }
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
  .get('/api/group/v1', (req, res, next) => {
    if (groupV1) {
      res.json(groupV1)
    } else {
      res.status(404).send()
    }
  })
  .get('/api/group/v2', (req, res, next) => {
    if (groupV2) {
      res.json(groupV2)
    } else {
      res.status(404).send()
    }
  })
  .get('/api/repo', (req, res, next) => {
    res.json(repos)
  })
  .get('/api/metadata/:version/:name/:repo', async (req, res, next) => {
    const { version, name, repo } = req.params

    if (version !== 'v1' && version !== 'v2') {
      return res.status(400).send()
    }

    const metadataPath = path.resolve(paths.metadata, name, repo, 'g0v.json')
    try {
      const metadata = await fs.readJson(metadataPath)

      if (version === 'v1') {
        winston.info(`Serve ${name}/${repo}/g0v.json`)
        res.json(metadata)
      }

      if (version === 'v2') {
        const patchPath = path.resolve(paths.patch, name, repo, 'master.patch.json')
        const patch = await fs.readJson(patchPath)

        winston.info(`Serve patched ${name}/${repo}/g0v.json`)
        res.json({ ...metadata, ...patch })
      }
    } catch (err) {
      return res.status(404).send()
    }

  })
  // Serve client scripts
  .use(express.static(paths.appBuild))
  // Fallback to index page as the client is a single page application
  .use(fallback('index.html', { root: paths.appBuild }))
  .listen(env.API_PORT, function() {
    winston.info(`Running at ${env.PROTOCOL}://${env.API_HOST}:${env.API_PORT}`)
  })

