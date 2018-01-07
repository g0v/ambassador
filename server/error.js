const ExtError = require('es6-error')

class GitHubClientError extends ExtError {
  constructor() { super("GitHub client ID or secret isn't set") }
}

class DatabaseError extends ExtError {
  constructor() { super("Database isn't ready") }
}

class AdminError extends ExtError {
  constructor(email) { super(`${email} isn't an administrator`) }
}

module.exports = {
  GitHubClientError,
  DatabaseError,
  AdminError
}
