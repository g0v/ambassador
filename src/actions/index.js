import {
  Nop
} from '~/types'
import * as auth from './auth'
export { auth }

export const nop = store => async () => {
  const { dispatch } = store
  dispatch(Nop())
}

