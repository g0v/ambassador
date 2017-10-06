function test(db, next) {
  return db.query('SELECT NOW();', next)
}

function prepareTables(db, next) {
  return prepareHashtagTable(db, function(err, res) {
    if (err) return next(err)
    return prepareLogTable(db, function(err, res) {
      if (err) return next(err)
      return prepareLogHashtagTable(db, function(err, res) {
        if (err) return next(err)
        return next(err, res)
      })
    })
  })
}

function prepareHashtagTable(db, next) {
  return db.query(
    'CREATE TABLE IF NOT EXISTS hashtag (id serial PRIMARY KEY, content text);',
    next
  )
}

function listHashtag(db, next) {
  return db.query(
    'SELECT * FROM hashtag;',
    next
  )
}

function createHashtag(db, content, next) {
  return db.query(
    'INSERT INTO hashtag (content) VALUES ($1) RETURNING id;',
    [content],
    next
  )
}

function testHashtag(db, content, next) {
  return db.query(
    'SELECT EXISTS(SELECT 1 FROM hashtag WHERE content = $1);',
    [content],
    next
  )
}

function getHashtag(db, content, next) {
  return db.query(
    'SELECT * FROM hashtag WHERE content = $1 LIMIT 1;',
    [content],
    next
  )
}

function prepareLogTable(db, next) {
  return db.query(
    'CREATE TABLE IF NOT EXISTS log (id serial PRIMARY KEY, date char(10), index integer);',
    next
  )
}

function createLog(db, date, index, next) {
  return db.query(
    'INSERT INTO log (date, index) VALUES ($1, $2) RETURNING id;',
    [date, index],
    next
  )
}

function testLog(db, date, index, next) {
  return db.query(
    'SELECT EXISTS(SELECT 1 FROM log WHERE date = $1 AND index = $2);',
    [date, index],
    next
  )
}

function getLog(db, date, index, next) {
  return db.query(
    'SELECT l.id, l.date, l.index, array_remove(array_agg(h.hashtag), NULL) hashtags FROM log l LEFT JOIN logHashtag h ON l.id = h.log WHERE l.date = $1 AND l.index = $2 GROUP BY l.id LIMIT 1;',
    [date, index],
    next
  )
}

function prepareLogHashtagTable(db, next) {
  return db.query(
    'CREATE TABLE IF NOT EXISTS logHashtag (id serial PRIMARY KEY, log serial, hashtag serial);',
    next
  )
}

function linkLogWithHashtag(db, log, hashtag, next) {
  return db.query(
    'INSERT INTO logHashtag (log, hashtag) VALUES ($1, $2) RETURNING id;',
    [log, hashtag],
    next
  )
}

function unlinkLogWithHashtag(db, log, hashtag, next) {
  return db.query(
    'DELETE FROM logHashtag l WHERE l.log = $1 AND l.hashtag = $2 RETURNING l.id;',
    [log, hashtag],
    next
  )
}

module.exports = {
  test,
  prepareTables,
  prepareHashtagTable,
  listHashtag,
  createHashtag,
  testHashtag,
  getHashtag,
  prepareLogTable,
  createLog,
  testLog,
  getLog,
  prepareLogHashtagTable,
  linkLogWithHashtag,
  unlinkLogWithHashtag
}
