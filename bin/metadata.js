import fs from 'fs-extra'
import path from 'path'
import * as paths from './paths'

import GitHub from 'github-api'
import { Pool } from 'pg'
import db from '../server/database'

import axios from 'axios'
import { map, zipObj, zip, take } from 'ramda'
import { getUrl } from '../src/types'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })

const apiUrl = getUrl(process.env.PROTOCOL, process.env.API_HOST, process.env.API_PORT)

const fetchJsonFromList = (names) => {
  const [name, ...rest] = names

  if (name === undefined) return Promise.resolve([])

  console.log(`Fetch #${name}`)
  return axios.get(`${apiUrl}/api/github/${name}/g0v.json`)
    .then(({ data }) => fetchJsonFromList(rest).then(jsons => [data, ...jsons]))
    .catch(error => fetchJsonFromList(rest).then(jsons => [null, ...jsons]))
}

// main
db.test(pool)
  // try to use the stored access token to access GitHub
  .then(now => db.config.get(pool, 'access token'))
  .then(({ value: token }) => {
    console.log(token ? `The access token is ${token}` : 'Admin token not found')

    const gh = new GitHub({ token })
    const org = gh.getOrganization('g0v')
    return org.getRepos()
      .then(res => res.data)
      .then(map(rs => rs.full_name))
      .then(take(10))
      .then(names => fetchJsonFromList(names)
        .then(jsons => zip(names, jsons))
      )
  })
  .then(map(([name, json]) => {
    // 404 not found
    if (json === null) {
      // do nothing
      console.log(`#${name}: missing`)
      return
    }

    // ill-formed json
    if (typeof json === 'string') {
      console.log(`#${name}: ill-formed`)
      return
    }

    console.log(`#${name}: OK`)
    const filepath = path.resolve(paths.metadata, name, 'g0v.json')
    return fs.outputJson(filepath, json, { spaces: 2 })
  }))
  .catch(error => console.error(error))
