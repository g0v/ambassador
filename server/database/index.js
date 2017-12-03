const hashtag = require('./hashtag')
const log = require('./log')
const logHashtag = require('./logHashtag')
const keyword = require('./keyword')
const resource = require('./resource')

const test = (db) =>
  db.query('SELECT NOW();')
    .then(r => r.rows[0].now)

const prepare = (db) =>
  Promise.resolve()
    .then(() => hashtag.prepare(db))
    .then(() => log.prepare(db))
    .then(() => logHashtag.prepare(db))
    .then(() => keyword.prepare(db))
    .then(() => resource.prepare(db))

module.exports = {
  hashtag,
  log,
  logHashtag,
  keyword,
  resource,
  test,
  prepare
}
