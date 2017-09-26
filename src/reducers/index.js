/* @flow */

import type { PlainAction } from '~/types/action'

import {
  NOP
} from '~/types/action'
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT
} from '~/types/auth'
import {
  PROFILE_REQUEST,
  PROFILE_SUCCESS,
  PROFILE_FAILURE,
  MEMBER_REQUEST,
  MEMBER_SUCCESS,
  MEMBER_FAILURE,
  REPO_LIST_REQUEST,
  REPO_LIST_SUCCESS,
  REPO_LIST_FAILURE,
  ISSUE_LIST_REQUEST,
  ISSUE_LIST_SUCCESS,
  ISSUE_LIST_FAILURE
} from '~/types/github'

export type State = {
  ui: {
    login: boolean,
    checkMember: boolean,
    repos: boolean,
    issues: boolean
  },
  auth: ?any,
  github: {
    profile: ?any,
    isMember: ?boolean,
    repos: any[],
    issues: any[]
  }
}

export const initialState: State = {
  ui: {
    login: false,
    checkMember: false,
    repos: false,
    issues: false
  },
  auth: undefined,
  github: {
    profile: undefined,
    isMember: undefined,
    repos: [],
    issues: []
  }
}

export default (state: State = initialState, action: PlainAction): State => {
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
    case LOGOUT: {
      return {
        ...state,
        auth: undefined,
        github: {
          ...state.github,
          profile: undefined
        }
      }
    }

    case PROFILE_REQUEST: {
      return {
        ...state,
        ui: {
          ...state.ui,
          profile: true
        }
      }
    }
    case PROFILE_SUCCESS: {
      const { profile } = action
      console.log(profile)

      return {
        ...state,
        ui: {
          ...state.ui,
          profile: false
        },
        github: {
          ...state.github,
          profile
        }
      }
    }
    case PROFILE_FAILURE: {
      return {
        ...state,
        ui: {
          ...state.ui,
          profile: false
        }
      }
    }

    case MEMBER_REQUEST: {
      return {
        ...state,
        ui: {
          ...state.ui,
          checkMember: true
        }
      }
    }
    case MEMBER_SUCCESS: {
      return {
        ...state,
        ui: {
          ...state.ui,
          checkMember: false
        },
        github: {
          ...state.github,
          isMember: true
        }
      }
    }
    case MEMBER_FAILURE: {
      return {
        ...state,
        ui: {
          ...state.ui,
          checkMember: false
        },
        github: {
          ...state.github,
          isMember: false
        }
      }
    }

    case REPO_LIST_REQUEST: {
      return {
        ...state,
        ui: {
          ...state.ui,
          repos: true
        }
      }
    }
    case REPO_LIST_SUCCESS: {
      const { repos } = action

      return {
        ...state,
        ui: {
          ...state.ui,
          repos: false
        },
        github: {
          ...state.github,
          repos
        }
      }
    }
    case REPO_LIST_FAILURE: {
      return {
        ...state,
        ui: {
          ...state.ui,
          repos: false
        }
      }
    }

    case ISSUE_LIST_REQUEST: {
      return {
        ...state,
        ui: {
          ...state.ui,
          issues: true
        }
      }
    }
    case ISSUE_LIST_SUCCESS: {
      const { issues } = action
      console.log('issues', issues)

      return {
        ...state,
        ui: {
          ...state.ui,
          issues: false
        },
        github: {
          ...state.github,
          issues
        }
      }
    }
    case ISSUE_LIST_FAILURE: {
      return {
        ...state,
        ui: {
          ...state.ui,
          issues: false
        }
      }
    }

    default:
      return state
  }
}

