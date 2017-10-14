const prepare = (db) =>
  db.query('CREATE TABLE IF NOT EXISTS logHashtag (id serial PRIMARY KEY, log serial, hashtag serial);')

const list = (db) =>
  db.query('SELECT * FROM logHashtag;')
    .then(r => r && r.rows)

// TODO: test = (db, log, hashtag) => {}

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
  list,
  link,
  unlink
}
