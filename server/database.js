const test = (db) =>
  db.query('SELECT NOW();')
    .then(r => r.rows[0].now)

const prepareTables = (db) =>
  Promise.resolve()
    .then(() => prepareHashtagTable(db))
    .then(() => prepareLogTable(db))
    .then(() => prepareLogHashtagTable(db))

const prepareHashtagTable = (db) =>
  db.query('CREATE TABLE IF NOT EXISTS hashtag (id serial PRIMARY KEY, content text);')

const listHashtag = (db) =>
  db.query('SELECT * FROM hashtag;')
    .then(r => r && r.rows)

const createHashtag = (db, content) =>
  db.query(
    'INSERT INTO hashtag (content) VALUES ($1) RETURNING *;',
    [content]
  )
    .then(r => r && r.rows && r.rows[0])

const testHashtag = (db, content) =>
  db.query(
    'SELECT EXISTS(SELECT 1 FROM hashtag WHERE content = $1);',
    [content]
  )
    .then(r => r && r.rows && r.rows[0] && r.rows[0].exists)

const getHashtag = (db, content) =>
  db.query(
    'SELECT * FROM hashtag WHERE content = $1 LIMIT 1;',
    [content]
  )
    .then(r => r && r.rows && r.rows[0])

const prepareLogTable = (db) =>
  db.query('CREATE TABLE IF NOT EXISTS log (id serial PRIMARY KEY, date char(10), index integer);')

const listLog = (db) =>
  db.query('SELECT * FROM log;')
    .then(r => r && r.rows)

const createLog = (db, date, index) =>
  db.query(
    'INSERT INTO log (date, index) VALUES ($1, $2) RETURNING *;',
    [date, index]
  )
    .then(r => r && r.rows && r.rows[0])

const testLog = (db, date, index) =>
  db.query(
    'SELECT EXISTS(SELECT 1 FROM log WHERE date = $1 AND index = $2);',
    [date, index]
  )
    .then(r => r && r.rows && r.rows[0] && r.rows[0].exists)

const getLog = (db, date, index) =>
  db.query(
    'SELECT l.id, l.date, l.index, array_remove(array_agg(h.hashtag), NULL) hashtags FROM log l LEFT JOIN logHashtag h ON l.id = h.log WHERE l.date = $1 AND l.index = $2 GROUP BY l.id LIMIT 1;',
    [date, index]
  )
    .then(r => r && r.rows && r.rows[0])

const prepareLogHashtagTable = (db) =>
  db.query('CREATE TABLE IF NOT EXISTS logHashtag (id serial PRIMARY KEY, log serial, hashtag serial);')

const listLogHashtagLink = (db) =>
  db.query('SELECT * FROM logHashtag;')
    .then(r => r && r.rows)

// TODO: testLogWithHashtag = (db, log, hashtag) => {}

const linkLogWithHashtag = (db, log, hashtag) =>
  db.query(
    'INSERT INTO logHashtag (log, hashtag) VALUES ($1, $2) RETURNING *;',
    [log, hashtag]
  )
    .then(r => r && r.rows && r.rows[0])

const unlinkLogWithHashtag = (db, log, hashtag) =>
  db.query(
    'DELETE FROM logHashtag l WHERE l.log = $1 AND l.hashtag = $2 RETURNING *;',
    [log, hashtag]
  )
    .then(r => r && r.rows && r.rows[0])

module.exports = {
  test,
  prepareTables,
  prepareHashtagTable,
  listHashtag,
  createHashtag,
  testHashtag,
  getHashtag,
  prepareLogTable,
  listLog,
  createLog,
  testLog,
  getLog,
  prepareLogHashtagTable,
  listLogHashtagLink,
  linkLogWithHashtag,
  unlinkLogWithHashtag
}
