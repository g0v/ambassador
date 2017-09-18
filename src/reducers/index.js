import {
  NOP
} from '~/types'

export const initialState = {
}

export default (state = initialState, action) => {
  switch(action.type) {
    case NOP: {
      console.log('no-op')
      return state
    }
    default:
      return state
  }
}

