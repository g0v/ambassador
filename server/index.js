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
// config
const paths = require(path.resolve(__dirname, '../config/paths.js'))

// service status
const status = {
  database: false
}

const connectionString = process.env.DATABASE_URL || ''
const pool = new Pool({ connectionString })
db.test(pool, function(err, res) {
  if (err) return winston.error(err)
  winston.debug(res.rows)
  winston.verbose('Database connected')
  db.prepareTables(pool, function(err, res) {
    if (err) return winston.error(err)
    winston.verbose('Tables are ready')
    status.database = true
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
  .use(function(err, req, res, next) {
    winston.error(err.stack)
    res.status(500)
  })
  .get('/api/auth', function(req, res) {
    if (!client_id || !client_secret) {
      throw new Error('Client ID or secret is not set.')
    }

    const endpoint = 'https://github.com/login/oauth/authorize?scope=user:email&client_id=' + client_id
    res.redirect(303, endpoint)
  })
  .get('/api/callback', function(req, res, next) {
    if (!client_id || !client_secret) {
      throw new Error('Client ID or secret is not set.')
    }

    const { code } = req.query
    if (!code) {
      throw new Error('OAuth code is missing.')
    }

    axios({
      method: 'post',
      url: 'https://github.com/login/oauth/access_token',
      data: { client_id, client_secret, code }
    })
      .then(function(result) {
        if (result.data.error) {
          winston.error(result.data)
          throw new Error(result.data.error)
        }

        const endpoint = '/callback?' + result.data
        res.redirect(303, endpoint)
      })
      .catch(next)
  })
  // return current API status
  .get('/api/status', function(req, res, next) {
    res.json(status)
  })
  // proxy Logbot API before we add the CORS header to that service
  .get('/api/logbot/:channel/:date', function(req, res, next) {
    axios.get(process.env.LOGBOT_URL + '/channel/' + req.params.channel + '/' + req.params.date + '/json')
      .then(function(result) {
        if (result.data.error) {
          winston.error(result.data)
          throw new Error(result.data.error)
        }

        res.json(result.data)
      })
      .catch(next)
  })
  .use(express.static(paths.appBuild))
  .use(fallback('index.html', { root: paths.appBuild }))
  .listen(port, function() {
    winston.info(`Running at ${protocol}://${host}:${port}`)
  })

