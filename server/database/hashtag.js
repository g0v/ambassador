const prepare = (db) =>
  db.query('CREATE TABLE IF NOT EXISTS hashtag (id serial PRIMARY KEY, content text);')

const drop = (db) =>
  db.query('DROP TABLE IF EXISTS hashtag;')

const list = (db) =>
  db.query('SELECT * FROM hashtag;')
    .then(r => r && r.rows)

const create = (db, content) =>
  db.query(
    'INSERT INTO hashtag (content) VALUES ($1) RETURNING *;',
    [content]
  )
    .then(r => r && r.rows && r.rows[0])

const test = (db, content) =>
  db.query(
    'SELECT EXISTS(SELECT 1 FROM hashtag WHERE content = $1);',
    [content]
  )
    .then(r => r && r.rows && r.rows[0] && r.rows[0].exists)

const get = (db, content) =>
  db.query(
    'SELECT * FROM hashtag WHERE content = $1 LIMIT 1;',
    [content]
  )
    .then(r => r && r.rows && r.rows[0])

module.exports = {
  prepare,
  drop,
  list,
  create,
  test,
  get
}
