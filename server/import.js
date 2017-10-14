const path = require('path')
const { Pool } = require('pg')
const db = require('./database')
const { map } = require('ramda')

const [,, rawPath] = process.argv
const jsonPath = path.resolve(process.cwd(), rawPath || '')

if (jsonPath.endsWith('.json')) {
  const connectionString = process.env.DATABASE_URL || ''
  const pool = new Pool({ connectionString })
  const backup = require(jsonPath)
  let hashtagMap = {}
  let logMap = {}

  Promise.all([
    db.logHashtag.drop(pool),
    db.log.drop(pool),
    db.hashtag.drop(pool)
  ])
    .then(() =>
      Promise.all([
        db.hashtag.prepare(pool),
        db.log.prepare(pool),
        db.logHashtag.prepare(pool)
      ])
    )
    .then(() => {
      let ps = []

      if (backup.hashtag) {
        let prevId
        const p = map(
          ({ id, content }) =>
            db.hashtag.create(pool, content)
              .then(({ id: newId }) => hashtagMap[id] = newId),
          backup.hashtag
        )
        ps.push(Promise.all(p))
      }
      if (backup.log) {
        const p = map(
          ({ id, date, index }) =>
            db.log.create(pool, date, index)
              .then(({ id: newId }) => logMap[id] = newId),
          backup.log
        )
        ps.push(Promise.all(p))
      }

      return Promise.all(ps)
    })
    .then(() => {
      if (backup.logHashtag) {
        const p = map(
          ({ log, hashtag }) => db.logHashtag.link(pool, logMap[log], hashtagMap[hashtag]),
          backup.logHashtag
        )

        return Promise.all(p)
      }
    })
    .then(() => console.log('Database imported'))
    .catch(err => console.error(err))
} else {
  console.error(`${rawPath} is not a JSON file`)
}
