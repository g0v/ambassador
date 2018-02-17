import fs from 'fs-extra'
import path from 'path'
import * as paths from './paths'
import Ajv from 'ajv'
import v1 from './schema/v1.json'
import { forEach, uniq } from 'ramda'

let group = {}
const groupConcat = o => name => {
  var g = group[name]

  if (!g) {
    g = group[name] = {
      children: [],
      keywords: [],
      products: [],
      contributors: [],
      needs: []
    }
  }

  g.children.push(o.name)
  if (o.keywords) g.keywords = g.keywords.concat(o.keywords)
  if (o.products) g.products = g.products.concat(o.products)
  if (o.contributors) g.contributors = g.contributors.concat(o.contributors)
  if (o.needs) g.needs = g.needs.concat(o.needs)
}

const groupCleanup = () => {
  for (const k in group) {
    const g = group[k]

    g.keywords = uniq(g.keywords)
    g.products = uniq(g.products)
    g.contributors = uniq(g.contributors)
    g.needs = uniq(g.needs)
  }
}

const ajv = new Ajv()
const validator = {
  v1: ajv.compile(v1),
  v2: undefined
}

let result = {
  v1: {
    total: 0,
    valid: 0
  },
  v2: {
    total: 0,
    valid: 0
  }
}

// main
;(async () => {
  const users = await fs.readdir(paths.metadata)

  for (const user of users) {
    const repopath = path.resolve(paths.metadata, user)
    const stats = await fs.stat(repopath)
    if (!stats.isDirectory()) continue
    const repos = await fs.readdir(repopath)

    for (const repo of repos) {
      const filepath = path.resolve(repopath, repo, 'g0v.json')
      const data = await fs.readJson(filepath)

      // v1
      if (data.partOf) {
        groupConcat(data)(data.partOf)
      }
      if (data.projects) {
        forEach(groupConcat(data), data.projects)
      }

      const valid = validator.v1(data)
      if (valid) {
        ++result.v1.valid
        console.log(`${user}/${repo}: o`)
      } else {
        console.log(`${user}/${repo}: x`)
        const errorpath = path.resolve(repopath, repo, 'errors.json')
        await fs.writeJson(errorpath, validator.v1.errors, { spaces: 2 })
      }

      ++result.v1.total

      // TODO: v2
      ++result.v2.total
    }
  }

  groupCleanup()
  const filepath = path.resolve(paths.metadata, 'group.v1.json')
  await fs.writeJson(filepath, group, { spaces: 2 })

  console.log(`\n${result.v1.valid}/${result.v1.total} g0v.json are valid`)
})()
  .catch(err => {
    console.error(err)
  })
