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

// XXX: SELECT DISTINCT is slow
const get = (db, keyword) =>
  db.query(
    'SELECT DISTINCT date, index FROM keyword WHERE keyword LIKE $1;',
    [`%${keyword}%`]
  )
    .then(r => r && r.rows)
    .then(logs => {
      return { keyword, logs }
    })

module.exports = {
  prepare,
  drop,
  list,
  create,
  test,
  hint,
  get
}
