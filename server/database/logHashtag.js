const prepare = (db) =>
  db.query('CREATE TABLE IF NOT EXISTS logHashtag (id serial PRIMARY KEY, log serial, hashtag serial);')

const drop = (db) =>
  db.query('DROP TABLE IF EXISTS logHashtag;')

const list = (db) =>
  db.query('SELECT * FROM logHashtag;')
    .then(r => r && r.rows)

// TODO: test = (db, log, hashtag) => {}

const getLogs = (db, hashtag) =>
  db.query(
    'SELECT l.* FROM logHashtag lh LEFT JOIN log l ON lh.log = l.id LEFT JOIN hashtag h ON lh.hashtag = h.id WHERE h.content = $1;',
    [hashtag]
  )
    .then(r => r && r.rows)

const link = (db, log, hashtag) =>
  db.query(
    'INSERT INTO logHashtag (log, hashtag) VALUES ($1, $2) RETURNING *;',
    [log, hashtag]
  )
    .then(r => r && r.rows && r.rows[0])

const unlink = (db, log, hashtag) =>
  db.query(
    'DELETE FROM logHashtag l WHERE l.log = $1 AND l.hashtag = $2 RETURNING *;',
    [log, hashtag]
  )
    .then(r => r && r.rows && r.rows[0])

module.exports = {
  prepare,
  drop,
  getLogs,
  list,
  link,
  unlink
}
