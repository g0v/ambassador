import {
  Nop
} from '~/types'
import * as auth from './auth'
import * as github from './github'
export { auth, github }

export const nop = store => async () => {
  const { dispatch } = store
  dispatch(Nop())
}

