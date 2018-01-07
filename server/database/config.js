const prepare = (db) =>
  db.query('CREATE TABLE IF NOT EXISTS config (key text PRIMARY KEY, value text);')

const drop = (db) =>
  db.query('DROP TABLE IF EXISTS config;')

const list = (db) =>
  db.query('SELECT * FROM config;')
    .then(r && r.rows)

const create = (db, key, value) =>
  db.query(
    'INSERT INTO config (key, value) VALUES ($1, $2) RETURNING *;',
    [key, value]
  )
    .then(r => r && r.rows && r.rows[0])

const get = (db, key) =>
  db.query(
    'SELECT * FROM config WHERE key = $1 LIMIT 1;',
    [key]
  )
    .then(r => r && r.rows && r.rows[0])

module.exports = {
  prepare,
  drop,
  list,
  create,
  get
}
