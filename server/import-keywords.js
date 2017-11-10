const path = require('path')
const { Pool } = require('pg')
const db = require('./database')
const R = require('ramda')

const [,, rawPath] = process.argv
const jsonPath = path.resolve(process.cwd(), rawPath || '')

if (jsonPath.endsWith('.json')) {
  const connectionString = process.env.DATABASE_URL || ''
  const pool = new Pool({ connectionString })
  const indices = require(jsonPath)
  const inputs = []

  for (let keyword in indices) {
    const logs = indices[keyword]
    for (let { date, index } of logs) {
      inputs.push({ keyword, date, index })
    }
  }

  Promise.resolve(db.keyword.drop(pool))
    .then(() => db.keyword.prepare(pool))
    .then(() => R.reduce(importKeyword(pool), Promise.resolve(), inputs))
    .then(() => process.stdout.write('\n'))
    .catch(err => console.error(err))
} else {
  console.error(`${rawPath} is not a JSON file`)
}

// XXX: import each records one by one
const importKeyword = pool => (p, o) =>
  p.then(() => db.keyword.create(pool, o.keyword, o.date, o.index))
   .then(() => process.stdout.write('.'))
