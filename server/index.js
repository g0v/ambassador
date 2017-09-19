const path = require('path')
// express
const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const webpackMiddleware = require('webpack-dev-middleware')
// webpack
const webpack = require('webpack')
const configPath = path.resolve(__dirname, '../config')
const configMode = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
const webpackConfig = require(path.resolve(configPath, 'webpack.config.' + configMode + '.js'))
const paths = require(path.resolve(configPath, 'paths.js'))

// variables
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
const host = process.env.HOST || '0'
const port = process.env.PORT || 80
const client_id = process.env.GH_BASIC_CLIENT_ID
const client_secret = process.env.GH_BASIC_CLIENT_SECRET

const app = express()
app
  .use(webpackMiddleware(webpack(webpackConfig), {
    compress: true,
    clientLogLevel: 'none',
    contentBase: paths.appPublic,
    watchContentBase: true,
    publicPath: webpackConfig.output.publicPath,
    quiet: true,
    watchOptions: {
      ignore: /node_modules/
    },
    https: protocol === 'https',
    host: host,
    overlay: false,
    historyApiFallback: {
      disableDotRule: true
    },
    stats: { colors: true }
  }))
  .use(bodyParser.json())
  .use(function(err, req, res, next) {
    console.error(err.stack)
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
      data: { client_id, client_secret, code },
      headers: { 'Accept': 'application/json' }
    })
      .then(function(result) {
        if (result.data.error) {
          console.error(result.data)
          throw new Error(result.data.error)
        }

        res.json(result.data)
        // should redirect to the application
      })
      .catch(next)
  })
  .listen(port, function() {
    console.log(`Server running at http://${host}:${port}`)
  })

