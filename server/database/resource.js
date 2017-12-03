const prepare = (db) =>
  db.query('CREATE TABLE IF NOT EXISTS resource (id serial PRIMARY KEY, uri text);')

const drop = (db) =>
  db.query('DROP TABLE IF EXISTS resource;')

const list = (db) =>
  db.query('SELECT * FROM resource;')
    .then(r => r && r.rows)

const create = (db, uri) =>
  db.query(
    'INSERT INTO resource (uri) VALUES ($1) RETURNING *;',
    [uri]
  )
    .then(r => r && r.rows && r.rows[0])

const test = (db, uri) =>
  db.query(
    'SELECT EXISTS(SELECT 1 FROM resource WHERE uri = $1);',
    [uri]
  )
    .then(r => r && r.rows && r.rows[0] && r.rows[0].exists)

module.exports = {
  prepare,
  drop,
  list,
  create,
  test
}
