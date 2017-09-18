import { map as _map } from 'ramda'

export const map = (f, o) =>
  _map(
    v => {
      switch(typeof v) {
        case 'object': return map(f, v)
        default: return f(v)
      }
    },
    o
  )

