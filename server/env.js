const { GitHubClientError, DatabaseError } = require('./error')

// Set default values and prevent reusing them from the client.
// So the server envs will not leak to the bundled script.
const envs = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  GH_BASIC_CLIENT_ID: process.env.GH_BASIC_CLIENT_ID || '',
  GH_BASIC_CLIENT_SECRET: process.env.GH_BASIC_CLIENT_SECRET || '',
  DATABASE_URL: process.env.DATABASE_URL || '',
  LOGBOT_URL: process.env.LOGBOT_URL || 'https://logbot.g0v.tw',
  PROTOCOL: process.env.HTTPS === 'true' ? 'https' : 'http',
  API_HOST: process.env.API_HOST || 'localhost',
  API_PORT: process.env.API_PORT || '80',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@example.com'
}

if (!envs.GH_BASIC_CLIENT_ID || !envs.GH_BASIC_CLIENT_SECRET) {
  throw new GitHubClientError()
}

if (!envs.DATABASE_URL) {
  throw new DatabaseError()
}

module.exports = envs
