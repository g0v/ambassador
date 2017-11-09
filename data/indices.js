const fs = require('fs-extra')
const path = require('path')
const U = require('./utils')
const R = require('ramda')

let indices = {}

const main = () => {
  fs.readdir(U.config.dataPath)
    .then(R.map(fillIndices))
    .then(ps => Promise.all(ps))
    .then(() => fs.writeJson(path.resolve(U.config.dataPath, 'index.json'), indices, { spaces: 2 }))
    .then(() => process.stdout.write('\n'))
}

const fillIndices = (filename) => {
  const date = filename.replace(/.json$/, '')
  const filePath = path.resolve(U.config.dataPath, filename)

  return fs.readJson(filePath)
    .then(ls => {
      if (!ls || !R.is(Number, ls.length)) return

      for (let index in ls) {
        const l = ls[index]
        index = +index
        const words = l.keywords

        for (let word of words) {
          switch (word) {
            case 'length':
            case 'constructor':
            case 'toString':
            case 'valueOf':
              continue;
          }

          try {
            if (!indices[word]) indices[word] = []
            indices[word].push({ date, index })
            process.stdout.write('.')
          } catch (err) {
            console.error(err, word)
          }
        }
      }
    })
}

main()
