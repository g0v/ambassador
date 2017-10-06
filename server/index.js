const path = require('path')
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
const logId = function(date, index) { return date + '#' + index }

const createRepoHashtags = function(pool, org, names, next) {
  const name = names[0]
  const rest = names.slice(1)

  if (name === undefined) {
    return next()
  }

  winston.verbose('Check #' + name)
  db.testHashtag(pool, name, function(err, r) {
    if (err) return next(err)
    if (r.rows[0].exists) {
      return createRepoHashtags(pool, org, rest, next)
    }

    winston.verbose('Create hashtag #' + name)
    db.createHashtag(pool, name, function(err, r) {
      if (err) return next(err)

      winston.info('Repo hashtag #' + name + ' is created')

      return createRepoHashtags(pool, org, rest, next)
    })
  })
}

const prepareRepoHashtags = function(pool, org, next) {
  org.getRepos(function(err, repos) {
    const names = map(r => r.full_name, repos)

    return createRepoHashtags(pool, org, names, next)
  })
}

const connectionString = process.env.DATABASE_URL || ''
const pool = new Pool({ connectionString })
db.test(pool, function(err, res) {
  if (err) return winston.error(err)
  winston.verbose('Database connected at ' + res.rows[0].now)
  db.prepareTables(pool, function(err, res) {
    if (err) return winston.error(err)

    winston.verbose('Tables are ready')

    const gh = new GitHub()
    // TODO: use process.env.GH_ORGANIZATION
    const org = gh.getOrganization('g0v')

    winston.verbose('Prepare repo hashtags')
    prepareRepoHashtags(pool, org, function(err) {
      if (err) return winston.error(err)

      winston.verbose('Repo hashtags are ready')

      status.database = true
    })
  })
})

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
  .use(function(err, req, res, next) {
    winston.error(err.stack)
    res.status(500).send()
  })
  // GitHub OAuth
  .get('/api/auth', function(req, res) {
    if (!client_id || !client_secret) {
      throw new Error('Client ID or secret is not set')
    }

    winston.verbose('Redirect to GitHub login page')
    const endpoint = 'https://github.com/login/oauth/authorize?scope=user:email&client_id=' + client_id
    res.redirect(303, endpoint)
  })
  // GitHub OAuth callback URL
  .get('/api/callback', function(req, res, next) {
    if (!client_id || !client_secret) {
      throw new Error('Client ID or secret is not set')
    }

    const { code } = req.query
    if (!code) {
      throw new Error('OAuth code is missing')
    }

    winston.verbose('Exchange access token with code: ' + code)
    axios({
      method: 'post',
      url: 'https://github.com/login/oauth/access_token',
      data: { client_id, client_secret, code }
    })
      .then(function(result) {
        if (result.data.error) {
          throw new Error(result.data.error)
        }

        winston.verbose('Access token: ' + result.data.access_token)
        const endpoint = '/callback?' + result.data
        res.redirect(303, endpoint)
      })
      .catch(next)
  })
  // API status
  .get('/api/status', function(req, res, next) {
    res.json(status)
  })
  // Get all hashtags
  .get('/api/hashtag', function(req, res, next) {
    if (!status.database) {
      throw new Error("Database isn't ready")
    }

    winston.verbose('Get all hasttags')
    db.listHashtag(pool, function(err, r) {
      if (err) return next(err)
      res.json(r.rows)
    })
  })
  // Get a hashtag
  .get('/api/hashtag/:tag', function(req, res, next) {
    if (!status.database) {
      throw new Error("Database isn't ready")
    }

    const tag = req.params.tag

    winston.verbose('Get hashtag: #' + tag)
    db.getHashtag(pool, tag, function(err, r) {
      if (err) return next(err)
      if (r.rows.length === 0) {
        return res.status(404).send()
      }

      res.json(r.rows[0])
    })
  })
  // Create new hashtag
  .post('/api/hashtag/:tag', function(req, res, next) {
    if (!status.database) {
      throw new Error("Database isn't ready")
    }

    const tag = req.params.tag

    winston.verbose('Check hashtag: #' + tag)
    db.testHashtag(pool, tag, function(err, r0) {
      if (err) return next(err)
      if (r0.rows[0].exists) {
        return res.status(409).send('Hashtag Exists')
      }

      winston.verbose('Create hashtag: #' + tag)
      db.createHashtag(pool, tag, function(err, r1) {
        if (err) return next(err)

        winston.info('Hashtag: #' + tag + ' created')

        res.json({ id: r1.rows[0].id })
      })
    })
  })
  // Get a log
  .get('/api/logbot/:channel/:date/:index', function(req, res, next) {
    if (!status.database) {
      throw new Error("Database isn't ready")
    }

    const date = req.params.date
    const index = +req.params.index
    const channel = req.params.channel
    const id = logId(date, index)

    if (!logs[id]) {
      const url = process.env.LOGBOT_URL + '/channel/' + channel + '/' + date + '/json'
      winston.verbose('Fetch logs from ' + url)
      logs[id] = axios.get(url).then(function(result) { return result.data || {} })
    }

    logs[id]
      .then(function(ls) {
        const log = ls[index]

        if (log === undefined) {
          return res.status(404).send()
        }

        winston.verbose('Get log:' + id)
        db.getLog(pool, date, index, function(err, r) {
          if (err) return next(err)
          if (r.rows.length === 0) {
            return res.json(log)
          }

          res.json(Object.assign({}, r.rows[0], log))
        })
      })
  })
  // Create log entry so we can link it with hashtags later
  .post('/api/logbot/:channel/:date/:index', function(req, res, next) {
    if (!status.database) {
      throw new Error("Database isn't ready")
    }

    const date = req.params.date
    const index = +req.params.index

    winston.verbose('Check log: ' + date + '#' + index)
    db.testLog(pool, date, index, function(err, r0) {
      if (err) return next(err)
      if (r0.rows[0].exists) {
        return res.status(409).send('Log Exists')
      }

      winston.verbose('Create log: ' + date + '#' + index)
      db.createLog(pool, date, index, function(err, r1) {
        if (err) return next(err)

        winston.info('Log: ' + date + '#' + index + ' created')

        res.json({ id: r1.rows[0].id })
      })
    })
  })
  // Link a log with a hashtag
  .post('/api/log/:log_id/hashtag/:hashtag_id', function(req, res, next) {
    if (!status.database) {
      throw new Error("Database isn't ready")
    }

    const log_id = +req.params.log_id
    const hashtag_id = +req.params.hashtag_id

    winston.verbose('Link log: ' + log_id + ' with hashtag: ' + hashtag_id)
    db.linkLogWithHashtag(pool, log_id, hashtag_id, function(err, r) {
      if (err) return next(err)

      winston.info('Log: ' + log_id + ' is linked with hashtag: ' + hashtag_id)

      res.json({ id: r.rows[0].id, log: log_id, hashtag: hashtag_id  })
    })
  })
  .delete('/api/log/:log_id/hashtag/:hashtag_id', function(req, res, next) {
    if (!status.database) {
      throw new Error("Database isn't ready")
    }

    const log_id = +req.params.log_id
    const hashtag_id = +req.params.hashtag_id

    winston.verbose('Unlink log: ' + log_id + ' with hashtag: ' + hashtag_id)
    db.unlinkLogWithHashtag(pool, log_id, hashtag_id, function(err, r) {
      if (err) return next(err)

      winston.info('Log: ' + log_id + ' is unlinked whith hashtag: ' + hashtag_id)

      res.json({ id: r.rows[0].id, log: log_id, hashtag: hashtag_id })
    })
  })
  // Serve client scripts
  .use(express.static(paths.appBuild))
  // Fallback to index page as the client is a single page application
  .use(fallback('index.html', { root: paths.appBuild }))
  .listen(port, function() {
    winston.info(`Running at ${protocol}://${host}:${port}`)
  })

