// ENV:
//   DATABASE_URL
//   PROTOCOL
//   API_HOST
//   API_PORT
const fs = require('fs-extra')
const path = require('path')
const GitHub = require('github-api')
// XXX: should cleanup shared scripts between client and server
const dbPath = path.resolve(__dirname, '../server/database')
const { Pool } = require('pg')
const db = require(dbPath)
const axios = require('axios')
const { map, zipObj, zip, take } = require('ramda')

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })

// XXX: duplicated
const getUrl = function(protocol, host, port) {
  protocol = protocol || 'http'
  host = host || 'localhost'
  port = port || '80'
  let url = protocol + '://' + host
  if ((protocol === 'http' && port !== 80) || (protocol === 'https' && port !== '443')) {
    url += ':' + port
  }
  return url
}
const apiUrl = getUrl(process.env.PROTOCOL, process.env.API_HOST, process.env.API_PORT)

fetchJsonFromList = (names) => {
  const [name, ...rest] = names

  if (name === undefined) return Promise.resolve([])

  console.log(`Fetch #${name}`)
  return axios.get(`${apiUrl}/api/github/${name}/g0v.json`)
    .then(({ data }) => fetchJsonFromList(rest).then(jsons => [data].concat(jsons)))
    .catch(error => fetchJsonFromList(rest).then(jsons => [null].concat(jsons)))
}

db.test(pool)
  // try to use the stored access token to access GitHub
  .then(now => db.config.get(pool, 'access token'))
  .then(({ value }) => {
    let token = value

    console.log(token ? `The access token is ${token}` : 'Admin token not found')
    if (!token) token = undefined

    const gh = new GitHub({ token })
    const org = gh.getOrganization('g0v')
    return org.getRepos()
      .then(res => res.data)
      .then(map(rs => rs.full_name))
      //.then(take(10))
      .then(names =>
        fetchJsonFromList(names)
          .then(jsons =>
            zip(names, jsons)
          )
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
    const filepath = path.resolve(__dirname, 'g0v.json', name, 'g0v.json')
    return fs.outputFile(filepath, JSON.stringify(json, null, 2))
  }))
  .catch(error => console.error(error))
