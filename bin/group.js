import fs from 'fs-extra'
import path from 'path'
import * as paths from './paths'
import Ajv from 'ajv'
import v1 from './schema/v1.json'
import v2 from './schema/v2.json'
import { forEach, uniq, is } from 'ramda'

const ajv = new Ajv()
const validator = {
  v1: ajv.compile(v1),
  v2: ajv.compile(v2)
}

let result = {
  v1: {
    group: {},
    valid: 0,
    invalid: 0,
    missing: 0
  },
  v2: {
    group: {},
    groupMap: {},
    valid: 0,
    invalid: 0,
    missing: 0
  }
}

// TODO: save the group name
const groupConcat = (version, o) => name => {
  // could be ""
  if (!name) return

  if (version === 'v1') {
    let g = result.v1.group[name]

    if (!g) {
      g = result.v1.group[name] = {
        name,
        children: [],
        thumbnails: [],
        keywords: [],
        products: [],
        contributors: [],
        needs: []
      }
    }

    g.children.push(o.name)
    // XXX: should fix the schema
    if (o.thumbnail) {
      if (is(Array, o.thumbnail)) {
        g.thumbnails = g.thumbnails.concat(o.thumbnail)
      } else {
        g.thumbnails.push(o.thumbnail)
      }
    }
    if (o.keywords) g.keywords = g.keywords.concat(o.keywords)
    if (o.products) g.products = g.products.concat(o.products)
    if (o.contributors) g.contributors = g.contributors.concat(o.contributors)
    if (o.needs) g.needs = g.needs.concat(o.needs)
  }

  if (version === 'v2') {
    let g = result.v2.group[name]

    if (!g) {
      g = result.v2.group[name] = {
        url: name,
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
    // copy project descriptions
    if (url === name) {
      if (o.name) g.name = o.name
      if (o.name_zh) g.name_zh = o.name_zh
      if (o.description) g.description = o.description
      if (o.description_zh) g.description_zh = o.description_zh
    }
    if (o.thumbnail) {
      if (is(Array, o.thumbnail)) {
        g.thumbnails = g.thumbnails.concat(o.thumbnail)
      } else {
        g.thumbnails.push(o.thumbnail)
      }
    }
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

const getRepoUrl = o =>
  o && o.repository && o.repository.url

// main
;(async () => {
  const allpath = path.resolve(paths.data, 'repos.json')
  const all = await fs.readJson(allpath)
  const users = await fs.readdir(paths.v1)

  const groupList = []
  const groupMap = {}

  for (const user of users) {
    const repopath = path.resolve(paths.v1, user)
    const stats = await fs.stat(repopath)
    if (!stats.isDirectory()) continue
    const repos = await fs.readdir(repopath)

    for (const repo of repos) {
      let filepath = path.resolve(paths.v1, user, repo, 'g0v.json')
      let data = await fs.readJson(filepath)

      // v1
      if (data.partOf) {
        groupConcat('v1', data)(data.partOf)
      }
      if (data.projects) {
        forEach(groupConcat('v1', data), data.projects)
      }

      const valid = validator.v1(data)
      const errorpath = path.resolve(paths.v1, user, repo, 'errors.json')
      await fs.remove(errorpath)
      if (valid) {
        console.log(`${user}/${repo}: o`)
        ++result.v1.valid
      } else {
        console.log(`${user}/${repo}: x`)
        ++result.v1.invalid
        await fs.outputJson(errorpath, validator.v1.errors, { spaces: 2 })
      }

      // v2
      filepath = path.resolve(paths.patch, user, repo, 'master.patch.json')
      try {
        const patch = await fs.readJson(filepath)
        data = { ...data, ...patch }
        groupList.push(data)
        groupMap[getRepoUrl(data)] = data

        const valid = validator.v2(data)
        const errorpath = path.resolve(paths.patch, user, repo, 'errors.json')
        await fs.remove(errorpath)
        if (valid) {
          console.log(`${user}/${repo}: oo`)
          ++result.v2.valid
        } else {
          console.log(`${user}/${repo}: xx`)
          ++result.v2.invalid
          await fs.outputJson(errorpath, validator.v2.errors, { spaces: 2 })
        }
      } catch (err) {
        console.log(`can't patch ${user}/${repo}!`)
      }
    }
  }

  // v2
  for (const data of groupList) {
    if (data.group) {
      let root = data
      while (root.group !== getRepoUrl(root)) {
        const g = groupMap[root.group]
        if (g)
          root = g
        else
          break
      }
      groupConcat('v2', data)(root.group)
    }
  }

  groupCleanup()
  result.v1.missing = all.length - result.v1.valid - result.v1.invalid
  result.v1.group.status = {
    valid: result.v1.valid,
    invalid: result.v1.invalid,
    missing: result.v1.missing
  }
  result.v2.missing = all.length - result.v2.valid - result.v2.invalid
  result.v2.group.status = {
    valid: result.v2.valid,
    invalid: result.v2.invalid,
    missing: result.v2.missing
  }
  console.log('')

  let filepath
  filepath = path.resolve(paths.group, 'v1.json')
  await fs.outputJson(filepath, result.v1.group, { spaces: 2 })
  console.log(`v1: ${result.v1.valid}/${result.v1.invalid}/${result.v1.missing}`)

  filepath = path.resolve(paths.group, 'v2.json')
  await fs.outputJson(filepath, result.v2.group, { spaces: 2 })
  console.log(`v2: ${result.v2.valid}/${result.v2.invalid}/${result.v2.missing}`)
})()
  .catch(err => {
    console.error(err)
  })
