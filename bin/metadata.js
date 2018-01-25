import fs from 'fs-extra'
import path from 'path'
import * as paths from './paths'
import repos from '../data/repos.json'
import axios from 'axios'
import { map, zip, take } from 'ramda'

const fetchJsonFromList = (names) => {
  const [name, ...rest] = names

  if (name === undefined) return Promise.resolve([])

  console.log(`#${name}: fetching`)
  return axios.get(`https://raw.githubusercontent.com/${name}/master/g0v.json`)
    .then(({ data }) => fetchJsonFromList(rest).then(jsons => [data, ...jsons]))
    .catch(error => fetchJsonFromList(rest).then(jsons => [null, ...jsons]))
}

const pairWith = f => a => f(a).then(b => [a, b])

// main
Promise.resolve(repos)
  //.then(take(10))
  .then(pairWith(fetchJsonFromList))
  .then(([names, jsons]) => zip(names, jsons))
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
