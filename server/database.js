function test(db, next) {
  return db.query('SELECT NOW();', next)
}

function checkTable(db, schema, table, next) {
  return db.query(
    'SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = $1 AND table_name = $2);',
    [schema, table],
    next
  )
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

function createHashtag(db, content, next) {
  return db.query(
    'INSERT INTO hashtag (content) VALUES ($1)',
    [content],
    next
  )
}

function getHashtag(db, content, next) {
  return db.query(
    'SELECT id FROM hashtag where content = $1',
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
    'INSERT INTO log (date, index) VALUES ($1, $2);',
    [date, index],
    next
  )
}

function testLog(db, date, index, next) {
  return db.query(
    'SELECT EXISTS(SELECT 1 FROM log where date = $1 AND index = $2);',
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
    'INSERT INTO logHashtag (log, hashtag) VALUES ($1, $2)',
    [log, hashtag],
    next
  )
}

module.exports = {
  test,
  checkTable,
  prepareTables,
  prepareHashtagTable,
  createHashtag,
  getHashtag,
  prepareLogTable,
  createLog,
  testLog,
  prepareLogHashtagTable,
  linkLogWithHashtag,
}
