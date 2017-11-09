const path = require('path')

module.exports = {
  config: {
    DATE_FORMAT: 'YYYY-MM-DD',
    dataPath: path.resolve(__dirname, 'logs')
  },
  delay: t => o => new Promise(r => setTimeout(r, t, o))
}
