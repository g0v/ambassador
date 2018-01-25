import fs from 'fs-extra'
import path from 'path'
import * as paths from './paths'

let group = {}

let indent = 0
const log = (arg, ...args) => {
  let padding = ''
  for (let i = 0; i < indent; ++i) padding += '  '
  console.log(padding + arg, ...args)
}

// main
;(async () => {
  const users = await fs.readdir(paths.metadata)

  for (const user of users) {
    const repopath = path.resolve(paths.metadata, user)
    const repos = await fs.readdir(repopath)

    for (const repo of repos) {
      const filepath = path.resolve(repopath, repo, 'g0v.json')
      const data = await fs.readJson(filepath)

      console.log(`${user}/${repo}:`)

      indent = 1
      if (!data.author) log('author is missing')
      if (!data.status) log('status is missing')
      if (!data.name) log('name is missing')
      if (!data.name_zh) log('name_zh is missing')
      if (!data.description) log('description is missing')
      if (!data.description_zh) log('description_zh is missing')
      if (!data.homepage) log('homepage is missing')
      if (!data.thumbnail) log('thunmbnail is missing')
      if (!data.document) log('document is missing')
      if (!data.repository) log('repository is missing')
      if (!data.licenses) log('licenses are missing')
      if (data.license) log('misspell licenses as license')
      if (!data.keywords) log('keywords are missing')
      if (data.keyword) log('misspell keywords as keyword')
      if (!data.audience) log('audience is missing')
      if (!data.products) log('proudcts are missing')
      if (data.product) log('misspell products as product')
      if (!data.projects) log('projects are missing')
      if (data.project) log('misspell projects as project')
      if (!data.contributors) log('contributors are missing')
      if (data.contributor) log('misspell contributors as contributor')
      if (!data.needs) log('needs are missing')
      if (data.need) lag('misspell needs as need')
    }
  }
})()
