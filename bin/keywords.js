import fs from 'fs-extra'
import path from 'path'
import axios from 'axios'
import moment from 'moment'
import jieba from 'nodejieba'
import { map } from 'ramda'

import * as paths from './paths'
import { DATE_FORMAT } from '../src/types/logbot'
import { delay } from '../src/types/time'

const logbotUrl = process.env.LOGBOT_URL || 'http://example.com'
const getUrl = (date) => `${logbotUrl}/channel/g0v.tw/${date}/json`

const dates = function *(begin, end) {
  let m = moment(begin)
  let date

  do {
    date = m.format(DATE_FORMAT)
    yield date
    m.add(1, 'days')
  } while(date !== end)
}

const begin = process.env.DDAY
const end = moment().format(DATE_FORMAT)

const main = () => {
  const ds = dates(begin, end)

  // XXX: `jieba.cut*` is unusable without traditional chinese dictionary
  jieba.load()

  fs.ensureDir(paths.logs)
    .then(() => {
      let ps = []

      for (let d of ds) {
        // TODO: skip existing files
        const outputPath = path.resolve(paths.logs, `${d}.json`)
        const p = fs.exists(outputPath)
          .then(exists =>
            exists
              ? true
              : Promise.resolve()
                  .then(delay(60000 * Math.random()))
                  .then(() => axios.get(getUrl(d)).then(d => d.data))
                  .then(map(extractKeywords))
                  .then(ls => {
                    console.log(`extracting keywords of ${d} ...`)
                    return fs.writeJson(outputPath, ls, { spaces: 2 })
                  })
          )
        ps.push(p)
      }

      return Promise.all(ps)
    })
    .catch(e => console.error(e))
}

const extractKeywords = (log) => {
  const ks = jieba.extract(log.msg, Number.MAX_SAFE_INTEGER)
  let keywords = [normalizeNick(log.nick)]

  for (const k of ks) keywords.push(k.word)

  return Object.assign({}, log, { keywords })
}

// TODO
const normalizeNick = (nick) => {
  return (
    nick
      .replace(/^ⓢ\s*/, '')
      .replace(/^🅣\s*/, '')
      .replace(/_+$/, '')
  )
}
main()
