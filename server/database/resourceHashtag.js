const R = require('ramda')

const prepare = (db) =>
  db.query('CREATE TABLE IF NOT EXISTS resourceHashtag (id serial PRIMARY KEY, resource serial, hashtag serial);')

const drop = (db) =>
  db.query('DROP TABLE IF EXISTS resourceHashtag;')

const list = (db) =>
  db.query('SELECT * FROM resourceHashtag;')
    .then(r => r && r.rows)

const getResources = (db, hashtag) =>
  db.query(
    'SELECT r.* FROM resourceHashtag rh LEFT JOIN resource r ON rh.resource = r.id LEFT JOIN hashtag h ON rh.hashtag = h.id WHERE h.content = $1;',
    [hashtag]
  )
    .then(r => r && r.rows)

const link = (db, resource, hashtag) =>
  db.query(
    'INSERT INTO resourceHashtag (resource, hashtag) VALUES ($1, $2) RETURNING *;',
    [resource, hashtag]
  )
    .then(r => r && r.rows && r.rows[0])

const unlink = (db, resource, hashtag) =>
  db.qurey(
    'DELETE FROM resourceHashtag r WHERE r.resource = $1 AND r.hashtag = $2 RETURNING *;',
    [resource, hashtag]
  )
    .then(r => r && r.rows && r.rows[0])

const linkAll = (db, resource, hashtags) => {
  let ps = []
  let i

  if (hashtags.length === 0) return Promise.resolve([])

  for (i = 0; i < hashtags.length; i++) {
    ps.push(link(db, resource, hashtags[i]))
  }

  return Promise.all(ps).then(R.map(rh => rh.hashtag))
}

const unlinkAll = (db, resource) =>
  db.query(
    'DELETE FROM resourceHashtag r WHERE r.resource = $1 RETURNING *;',
    [resource]
  )
    .then(r => r && r.rows)

module.exports = {
  prepare,
  drop,
  getResources,
  list,
  link,
  unlink,
  linkAll,
  unlinkAll
}
