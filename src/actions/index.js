import {
  Nop
} from '~/types'

export const nop = store => async () => {
  const { dispatch } = store
  dispatch(Nop())
}

