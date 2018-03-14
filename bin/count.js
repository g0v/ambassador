import fs from 'fs-extra'
import path from 'path'
import * as paths from './paths'

// main
;(async () => {
  const logsPath = paths.logs
  const logFiles = await fs.readdir(logsPath)
  let sum = 0

  for (const logFile of logFiles) {
    const logPath = path.resolve(paths.logs, logFile)
    const logs = await fs.readJson(logPath)

    if (logs.length) sum += logs.length
  }

  console.log(sum)
})()
  .catch(err => console.error(err))
