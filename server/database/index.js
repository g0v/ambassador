const hashtag = require('./hashtag')
const log = require('./log')
const logHashtag = require('./logHashtag')

const test = (db) =>
  db.query('SELECT NOW();')
    .then(r => r.rows[0].now)

const prepare = (db) =>
  Promise.resolve()
    .then(() => hashtag.prepare(db))
    .then(() => log.prepare(db))
    .then(() => logHashtag.prepare(db))

module.exports = {
  hashtag,
  log,
  logHashtag,
  test,
  prepare
}
