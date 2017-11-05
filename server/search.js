const R = require('ramda')
const moment = require('moment')

// XXX: duplicated
const DATE_FORMAT = 'YYYY-MM-DD'

const dates = function *(begin, end) {
  let m = moment(begin)
  let date

  do {
    date = m.format(DATE_FORMAT)
    yield date
    m.add(1, 'days')
  } while(date !== end)
}

const takeLastThree = R.compose(R.take(3), R.reverse)

const begin = process.env.DDAY
const end = moment().format(DATE_FORMAT)
console.log(takeLastThree([...dates(begin, end)]))
