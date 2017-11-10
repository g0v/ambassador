const fs = require('fs-extra')
const path = require('path')
const axios = require('axios')
const moment = require('moment')
const jieba = require('nodejieba')
const U = require('./utils')
const R = require('ramda')

const logbotUrl = process.env.LOGBOT_URL || 'http://example.com'
const getUrl = (date) => `${logbotUrl}/channel/g0v.tw/${date}/json`

const dates = function *(begin, end) {
  let m = moment(begin)
  let date

  do {
    date = m.format(U.config.DATE_FORMAT)
    yield date
    m.add(1, 'days')
  } while(date !== end)
}

const begin = process.env.DDAY
const end = moment().format(U.config.DATE_FORMAT)

const main = () => {
  const ds = dates(begin, end)

  // XXX: `jieba.cut*` is unusable without traditional chinese dictionary
  jieba.load()

  fs.ensureDir(U.config.dataPath)
    .then(() => {
      let ps = []

      for (let d of ds) {
        // TODO: skip existing files
        const outputPath = path.resolve(U.config.dataPath, `${d}.json`)
        const p = fs.exists(outputPath)
          .then(exists =>
            exists
              ? true
              : Promise.resolve()
                  .then(U.delay(60000 * Math.random()))
                  .then(() => axios.get(getUrl(d)).then(d => d.data))
                  .then(R.map(extractKeywords))
                  .then(ls => {
                    console.log(`extracting keywords of ${d} ...`)
                    return fs.writeJson(outputPath, ls, { spaces: 2 })
                  })
          )
        ps.push(p)
      }

      return Promise.all(ps)
    })
    .catch(err => console.error(err))
}

const extractKeywords = (log) => {
  const ks = jieba.extract(log.msg, Number.MAX_SAFE_INTEGER)
  let keywords = [normalizeNick(log.nick)]

  for (k of ks) keywords.push(k.word)

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