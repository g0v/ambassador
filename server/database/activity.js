const prepare = (db) =>
  db.query('CREATE TABLE IF NOT EXISTS activity (id serial PRIMARY KEY, type text, email text, login text, time bigint, fields text[]);')

const drop = (db) =>
  db.query('DROP TABLE IF EXISTS activity;')

// select without emails
const list = (db) =>
  db.query('SELECT id, type, login, time, fields FROM activity;')
    .then(r => r && r.rows)

const create = (db, type, email, login, time, fields) =>
  db.query(
    'INSERT INTO activity (type, email, login, time, fields) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
    [type, email, login, time, fields]
  )
    .then(r => r && r.rows && r.rows[0])

const createFromEntry = (db, entry) =>
  create(db, entry.type, entry.email, entry.login, entry.time, entry.fields)

const getByMail = (db, email) =>
  db.query(
    'SELECT * FROM activity WHERE email = $1;',
    [email]
  )
    .then(r => r && r.rows)

module.exports = {
  prepare,
  drop,
  list,
  create,
  createFromEntry,
  getByMail
}
