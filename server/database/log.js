const prepare = (db) =>
  db.query('CREATE TABLE IF NOT EXISTS log (id serial PRIMARY KEY, date char(10), index integer);')

const drop = (db) =>
  db.query('DROP TABLE IF EXISTS log;')

const list = (db) =>
  db.query('SELECT * FROM log;')
    .then(r => r && r.rows)

const create = (db, date, index) =>
  db.query(
    'INSERT INTO log (date, index) VALUES ($1, $2) RETURNING *;',
    [date, index]
  )
    .then(r => r && r.rows && r.rows[0])

const test = (db, date, index) =>
  db.query(
    'SELECT EXISTS(SELECT 1 FROM log WHERE date = $1 AND index = $2);',
    [date, index]
  )
    .then(r => r && r.rows && r.rows[0] && r.rows[0].exists)

const get = (db, date, index) =>
  db.query(
    'SELECT l.id, l.date, l.index, array_remove(array_agg(h.hashtag), NULL) hashtags FROM log l LEFT JOIN logHashtag h ON l.id = h.log WHERE l.date = $1 AND l.index = $2 GROUP BY l.id LIMIT 1;',
    [date, index]
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
