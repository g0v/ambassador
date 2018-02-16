import fs from 'fs-extra'
import path from 'path'
import * as paths from './paths'
import Ajv from 'ajv'
import v1 from './schema/v1.json'
import { forEach } from 'ramda'

let group = {}
const groupAppend = o => name => {
  if (!group[name]) {
    group[name] = []
  }

  group[name].push(o)
}

const ajv = new Ajv()
const validate = ajv.compile(v1)

let total = 0
let passed = 0

// main
;(async () => {
  const users = await fs.readdir(paths.metadata)

  for (const user of users) {
    const repopath = path.resolve(paths.metadata, user)
    const repos = await fs.readdir(repopath)

    for (const repo of repos) {
      const filepath = path.resolve(repopath, repo, 'g0v.json')
      const data = await fs.readJson(filepath)

      // v1
      if (data.partOf) {
        groupAppend(data.name)(data.partOf)
      }
      if (data.projects) {
        forEach(groupAppend(data.name), data.projects)
      }

      const valid = validate(data)
      if (valid) {
        ++passed
        console.log(`${user}/${repo}: o`)
      } else {
        console.log(`${user}/${repo}: x`)
        const errorpath = path.resolve(repopath, repo, 'errors.json')
        await fs.writeJson(errorpath, validate.errors, { spaces: 2 })
      }

      ++total

      // TODO: v2
    }
  }

  const filepath = path.resolve(paths.metadata, 'group.v1.json')
  await fs.writeJson(filepath, group, { spaces: 2 })

  console.log(`\n${passed}/${total} g0v.json are valid`)
})()
