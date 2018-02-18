import fs from 'fs-extra'
import path from 'path'
import * as paths from './paths'
import Ajv from 'ajv'
import v1 from './schema/v1.json'
import { forEach, uniq } from 'ramda'

const ajv = new Ajv()
const validator = {
  v1: ajv.compile(v1),
  v2: undefined
}

let result = {
  v1: {
    group: {},
    total: 0,
    valid: 0
  },
  v2: {
    group: {},
    total: 0,
    valid: 0
  }
}

const groupConcat = (version, o) => name => {
  // could be ""
  if (!name) return

  if (version === 'v1') {
    let g = result.v1.group[name]

    if (!g) {
      g = result.v1.group[name] = {
        children: [],
        thumbnails: [],
        keywords: [],
        products: [],
        contributors: [],
        needs: []
      }
    }

    g.children.push(o.name)
    if (o.thumbnail) g.thumbnails.push(o.thumbnail)
    if (o.keywords) g.keywords = g.keywords.concat(o.keywords)
    if (o.products) g.products = g.products.concat(o.products)
    if (o.contributors) g.contributors = g.contributors.concat(o.contributors)
    if (o.needs) g.needs = g.needs.concat(o.needs)
  }

  if (version === 'v2') {
    let g = result.v2.group[name]

    if (!g) {
      g = result.v2.group[name] = {
        children: [],
        thumbnails: [],
        keywords: [],
        products: [],
        contributors: [],
        needs: []
      }
    }

    let url = o && o.repository && o.repository.url
    if (url) g.children.push(url)
    if (o.thumbnail) g.thumbnails.push(o.thumbnail)
    if (o.keywords) g.keywords = g.keywords.concat(o.keywords)
    if (o.products) g.products = g.products.concat(o.products)
    if (o.contributors) g.contributors = g.contributors.concat(o.contributors)
    if (o.needs) g.needs = g.needs.concat(o.needs)
  }
}

const groupCleanup = () => {
  for (const k in result.v1.group) {
    const g = result.v1.group[k]

    g.thumbnails = uniq(g.thumbnails)
    g.keywords = uniq(g.keywords)
    g.products = uniq(g.products)
    g.contributors = uniq(g.contributors)
    g.needs = uniq(g.needs)
  }

  for (const k in result.v2.group) {
    const g = result.v2.group[k]

    g.thumbnails = uniq(g.thumbnails)
    g.keywords = uniq(g.keywords)
    // TODO: product is not a string anymore
    g.products = uniq(g.products)
    g.contributors = uniq(g.contributors)
    g.needs = uniq(g.needs)
  }
}

// main
;(async () => {
  const users = await fs.readdir(paths.v1)

  for (const user of users) {
    const repopath = path.resolve(paths.v1, user)
    const stats = await fs.stat(repopath)
    if (!stats.isDirectory()) continue
    const repos = await fs.readdir(repopath)

    for (const repo of repos) {
      let filepath = path.resolve(repopath, repo, 'g0v.json')
      let data = await fs.readJson(filepath)

      // v1
      if (data.partOf) {
        groupConcat('v1', data)(data.partOf)
      }
      if (data.projects) {
        forEach(groupConcat('v1', data), data.projects)
      }

      const valid = validator.v1(data)
      if (valid) {
        ++result.v1.valid
        console.log(`${user}/${repo}: o`)
      } else {
        console.log(`${user}/${repo}: x`)
        const errorpath = path.resolve(repopath, repo, 'errors.json')
        await fs.outputJson(errorpath, validator.v1.errors, { spaces: 2 })
      }

      ++result.v1.total

      // v2
      filepath = path.resolve(paths.patch, user, repo, 'master.patch.json')
      try {
        const patch = await fs.readJson(filepath)
        data = { ...data, ...patch }

        if (data.group) {
          groupConcat('v2', data)(data.group)
        }

        // TODO: validation
      } catch (err) {
        console.log(`can't patch ${user}/${repo}!`)
      }

      ++result.v2.total
    }
  }

  groupCleanup()
  console.log('')

  let filepath
  filepath = path.resolve(paths.group, 'v1.json')
  await fs.outputJson(filepath, result.v1.group, { spaces: 2 })
  console.log(`${result.v1.valid}/${result.v1.total} v1 g0v.json are valid`)

  filepath = path.resolve(paths.group, 'v2.json')
  await fs.outputJson(filepath, result.v2.group, { spaces: 2 })
  console.log(`${result.v2.valid}/${result.v2.total} v2 g0v.json are valid`)
})()
  .catch(err => {
    console.error(err)
  })
