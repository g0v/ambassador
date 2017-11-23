const R = require('ramda')

const prepare = (db) =>
  db.query('CREATE TABLE IF NOT EXISTS keyword (id serial PRIMARY KEY, keyword text, date char(10), index integer);')

const drop = (db) =>
  db.query('DROP TABLE IF EXISTS keyword;')

const list = (db) =>
  db.query('SELECT * FROM keyword;')
    .then(r => r && r.rows)

const create = (db, keyword, date, index) =>
  db.query(
    'INSERT INTO keyword (keyword, date, index) VALUES ($1, $2, $3) RETURNING *;',
    [keyword, date, index]
  )
    .then(r => r && r.rows && r.rows[0])

const test = (db, keyword, date, index) =>
  db.query(
    'SELECT EXISTS(SELECT 1 FROM keyword WHERE keyword = $1 AND date = $2 AND index = $3);',
    [keyword, date, index]
  )
    .then(r => r && r.rows && r.rows[0] && r.rows[0].exists)

const hint = (db, keyword) =>
  db.query(
    'SELECT DISTINCT keyword FROM keyword WHERE keyword LIKE $1;',
    [`%${keyword}%`]
  )
    .then(r => r && r.rows)
    .then(R.map(R.prop('keyword')))

const get = (db, keyword, options = {}) => {
  const { limit = 10, offset = 0 } = options

  // XXX: count should count distinct rows
  return db.query(
    'SELECT DISTINCT date, index, COUNT(*) OVER() AS total FROM keyword WHERE keyword LIKE $1 ORDER BY date LIMIT $2 OFFSET $3;',
    [`%${keyword}%`, limit, offset]
  )
    .then(r => r && r.rows)
    .then(logs => {
      let total = 0
      if (logs.length) {
        total = +logs[0].total
      }
      logs.forEach(l => delete l.total)
      return { keyword, total, logs }
    })
}

module.exports = {
  prepare,
  drop,
  list,
  create,
  test,
  hint,
  get
}
