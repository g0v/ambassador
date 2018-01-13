import fs from 'fs-extra'
import path from 'path'
import { map, is } from 'ramda'

import * as paths from './paths'

let indices = {}

const main = () => {
  fs.readdir(paths.logs)
    .then(map(fillIndices))
    .then(ps => Promise.all(ps))
    .then(() => fs.writeJson(path.resolve(paths.logs, 'index.json'), indices, { spaces: 2 }))
    .then(() => process.stdout.write('\n'))
    .catch(e => console.error(e))
}

const fillIndices = (filename) => {
  const date = filename.replace(/\.json$/, '')
  const filePath = path.resolve(paths.logs, filename)

  return fs.readJson(filePath)
    .then(ls => {
      if (!ls || !is(Number, ls.length)) return

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
