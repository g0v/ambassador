const fs = require('fs-extra')
const path = require('path')
const U = require('./utils')
const R = require('ramda')

const main = () => {
  fs.readdir(U.config.dataPath)
    .then(files => {
      console.log(files)
    })
}

main()
