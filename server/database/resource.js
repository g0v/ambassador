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

const get = (db, id) =>
  db.query(
    'SELECT r.id, r.uri, array_remove(array_agg(h.hashtag), NULL) hashtags FROM resource r LEFT JOIN resourceHashtag h ON r.id = h.resource WHERE r.id = $1 GROUP BY r.id LIMIT 1;',
    [id]
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
