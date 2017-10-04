/* @flow */

import type { PlainAction } from '~/types/action'
import type { Log } from '~/types/logbot'
import type { Hashtag } from '~/types/hashtag'

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
import {
  DATE_FORMAT,
  DATE_CHANGE,
  LOG_REQUEST,
  LOG_SUCCESS,
  LOG_FAILURE,
  getLogs
} from '~/types/logbot'
import {
  HASHTAG_LIST_REQUEST,
  HASHTAG_LIST_SUCCESS,
  HASHTAG_LIST_FAILURE
} from '~/types/hashtag'
import { findIndex } from 'ramda'
import moment from 'moment'

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
    issues: { [key: string]: any[] }
  },
  logbot: {
    date: string,
    logs: Log[]
  },
  hashtags: ?{ [key: number]: Hashtag }
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
    issues: {}
  },
  logbot: {
    date: moment().format(DATE_FORMAT),
    logs: []
  },
  hashtags: undefined
}

export default (state: State = initialState, action: PlainAction): State => {
  switch(action.type) {
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
      const { repo } = action
      const issues = { ...state.github.issues, [repo]: action.issues }

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

    case DATE_CHANGE: {
      const { date } = action

      return {
        ...state,
        logbot: {
          ...state.logbot,
          date
        }
      }
    }
    case LOG_REQUEST: {
      const { date, index } = action
      const log = { date, index }

      return {
        ...state,
        logbot: {
          ...state.logbot,
          logs: [...state.logbot.logs, log]
        }
      }
    }
    case LOG_SUCCESS: {
      const { date, index, log } = action
      const logs = getLogs(state)
      const i = findIndex(l => l.date === date && l.index === index, logs)

      if (i === -1) {
        console.error(`log not found: ${date}#${index}`)
        return state
      }

      const newLogs = [
        ...logs.slice(0, i),
        { ...logs[i], ...log },
        ...logs.slice(i + 1)
      ]

      return {
        ...state,
        logbot: {
          ...state.logbot,
          logs: newLogs
        }
      }
    }
    case LOG_FAILURE: {
      const { error } = action
      let logs = state.logbot.logs
      logs = logs.slice(0, logs.length - 1)

      console.error(error)

      return {
        ...state,
        logbot: {
          ...state.logbot,
          logs
        }
      }
    }

    case HASHTAG_LIST_REQUEST: {
      return {
        ...state,
        hashtags: {}
      }
    }
    case HASHTAG_LIST_SUCCESS: {
      let hashtags = {}

      for (let hashtag of action.hashtags) {
        hashtags[hashtag.id] = hashtag
      }

      return {
        ...state,
        hashtags
      }
    }
    case HASHTAG_LIST_FAILURE: {
      return {
        ...state,
        hashtags: undefined
      }
    }

    default:
      return state
  }
}

