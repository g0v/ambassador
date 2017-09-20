import {
  NOP
} from '~/types'
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE
} from '~/types/auth'

export const initialState = {
  ui: {
    login: false
  },
  auth: undefined
}

export default (state = initialState, action) => {
  switch(action.type) {
    case NOP: {
      console.log('no-op')
      return state
    }

    case LOGIN_REQUEST: {
      return {
        ...state,
        ui: {
          ...state.ui,
          login: true
        }
      }
    }
    case LOGIN_SUCCESS: {
      const { auth } = action

      console.log('auth', auth)

      return {
        ...state,
        ui: {
          ...state.ui,
          login: false
        },
        auth
      }
    }
    case LOGIN_FAILURE: {
      return {
        ...state,
        ui: {
          ...state.ui,
          login: false
        }
      }
    }

    default:
      return state
  }
}

