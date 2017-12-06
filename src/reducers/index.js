/* @flow */

import type { PlainAction } from '~/types/action'
import type { Log } from '~/types/logbot'
import type { Hashtag } from '~/types/hashtag'
import type { Resource } from '~/types/resource'

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
  ISSUE_LIST_FAILURE,
  INTRO_REQUEST,
  INTRO_SUCCESS,
  INTRO_FAILURE
} from '~/types/github'
import {
  DATE_FORMAT,
  LOG_REQUEST,
  LOG_SUCCESS,
  LOG_FAILURE,
  LOG_STORE,
  LOG_LINK_REQUEST,
  LOG_LINK_SUCCESS,
  LOG_LINK_FAILURE,
  LOG_UNLINK_REQUEST,
  LOG_UNLINK_SUCCESS,
  LOG_UNLINK_FAILURE,
  LOG_HIDE,
  getLogs
} from '~/types/logbot'
import {
  HASHTAG_LIST_REQUEST,
  HASHTAG_LIST_SUCCESS,
  HASHTAG_LIST_FAILURE,
  HASHTAG_CREATE_REQUEST,
  HASHTAG_CREATE_SUCCESS,
  HASHTAG_CREATE_FAILURE
} from '~/types/hashtag'
import {
  SEARCH_CHANGE,
  HINT_REQUEST,
  HINT_SUCCESS,
  HINT_FAILURE,
  SEARCH_REQUEST,
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
  SEARCH_PAGE
} from '~/types/search'
import {
  RESOURCE_LIST_REQUEST,
  RESOURCE_LIST_SUCCESS,
  RESOURCE_LIST_FAILURE,
  RESOURCE_CREATE_REQUEST,
  RESOURCE_CREATE_SUCCESS,
  RESOURCE_CREATE_FAILURE,
  RESOURCE_CREATE_DISMISS
} from '~/types/resource'
import { findIndex } from 'ramda'
import moment from 'moment'

export type State = {
  ui: {
    login: boolean,
    checkMember: boolean,
    repos: boolean,
    issues: boolean,
    resources: {
      isLoading: boolean,
      isCreating: boolean,
      error: ?Error
    },
    search: {
      isLoading: boolean,
      results: string[],
      value: string,
      total: number,
      page: number
    }
  },
  auth: ?any,
  github: {
    profile: ?any,
    isMember: ?boolean,
    repos: any[],
    issues: { [key: string]: any[] }
  },
  intros: { [key: string]: string },
  logbot: {
    logs: Log[]
  },
  hashtags: { [key: number]: Hashtag },
  logs: { [key: string]: Log },
  resources: Resource[],
  search: {
    logs: Log[]
  }
}

export const initialState: State = {
  ui: {
    login: false,
    checkMember: false,
    repos: false,
    issues: false,
    resources: {
      isLoading: false,
      isCreating: false,
      error: undefined
    },
    search: {
      isLoading: false,
      results: [],
      value: '',
      total: 0,
      page: 0
    }
  },
  auth: undefined,
  github: {
    profile: undefined,
    isMember: undefined,
    repos: [],
    issues: {}
  },
  intros: {},
  logbot: {
    date: moment().format(DATE_FORMAT),
    logs: []
  },
  hashtags: {},
  logs: {},
  resources: [],
  search: {
    logs: []
  }
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
    case INTRO_REQUEST: {
      return state
    }
    case INTRO_SUCCESS: {
      const { name, intro } = action

      return {
        ...state,
        intros: {
          [name]: intro
        }
      }
    }
    case INTRO_FAILURE: {
      return state
    }

    case LOG_STORE: {
      const { date, index } = action
      const logs = getLogs(state)
      let i = findIndex(l => l.date === date && l.index === index, logs)
      i = i !== -1 ? i : logs.length

      const newLogs = [
        ...logs.slice(0, i),
        { ...logs[i], date, index },
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
    case LOG_REQUEST: {
      const { date, index } = action
      const key = `${date}#${index}`

      return {
        ...state,
        logs: {
          ...state.logs,
          [key]: { date, index }
        }
      }
    }
    case LOG_SUCCESS: {
      const { date, index, log } = action
      const key = `${date}#${index}`

      return {
        ...state,
        logs: {
          ...state.logs,
          [key]: { date, index, ...log }
        }
      }
    }
    case LOG_FAILURE: {
      const { date, index, error } = action
      const key = `${date}#${index}`

      console.error(error)

      const logMap = state.logs
      delete logMap[key]

      return {
        ...state,
        logs: logMap
      }
    }
    case LOG_LINK_REQUEST: {
      return state
    }
    case LOG_LINK_SUCCESS: {
      return state
    }
    case LOG_LINK_FAILURE: {
      return state
    }
    case LOG_UNLINK_REQUEST: {
      return state
    }
    case LOG_UNLINK_SUCCESS: {
      return state
    }
    case LOG_UNLINK_FAILURE: {
      return state
    }
    case LOG_HIDE: {
      const { date, index } = action

      let logs = state.logbot.logs
      const i = findIndex(l => l.date === date && l.index === index, logs)

      if (i === -1) {
        console.error(`log not found: ${date}#${index}`)
        return state
      }

      logs = [
        ...logs.slice(0, i),
        ...logs.slice(i + 1)
      ]

      return {
        ...state,
        logbot: {
          ...state.logbot,
          logs
        }
      }
    }

    case HASHTAG_LIST_REQUEST: {
      return state
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
      return state
    }
    case HASHTAG_CREATE_REQUEST: {
      const { tag } = action

      return {
        ...state,
        hashtags: {
          ...state.hashtags,
          // insert the tag with a temporary id
          [tag.id]: tag
        }
      }
    }
    case HASHTAG_CREATE_SUCCESS: {
      const { id, tag } = action
      let hashtags = {
        ...state.hashtags,
        // add the real tag
        [tag.id]: tag
      }
      // remove the temporary tag
      delete hashtags[id]

      return {
        ...state,
        hashtags
      }
    }
    case HASHTAG_CREATE_FAILURE: {
      const { tag } = action
      let hashtags = { ...state.hashtags }
      // create failed, remove the temporary tag
      delete hashtags[tag.id]

      return {
        ...state,
        hashtags
      }
    }

    case SEARCH_CHANGE: {
      const { value } = action
      return {
        ...state,
        ui: {
          ...state.ui,
          search: {
            ...state.ui.search,
            value
          }
        }
      }
    }
    case HINT_REQUEST: {
      return {
        ...state,
        ui: {
          ...state.ui,
          search: {
            ...state.ui.search,
            isLoading: true
          }
        }
      }
    }
    case HINT_SUCCESS: {
      const { hints } = action

      return {
        ...state,
        ui: {
          ...state.ui,
          search: {
            ...state.ui.search,
            isLoading: false,
            results: hints
          }
        }
      }
    }
    case HINT_FAILURE: {
      const { error } = action

      console.error(error)

      return {
        ...state,
        ui: {
          ...state.ui,
          search: {
            ...state.ui.search,
            isLoading: false,
            results: []
          }
        }
      }
    }
    case SEARCH_REQUEST: {
      return state
    }
    case SEARCH_SUCCESS: {
      const { logs, total } = action

      return {
        ...state,
        ui: {
          ...state.ui,
          search: {
            ...state.ui.search,
            total,
            page: 0
          }
        },
        search: {
          ...state.search,
          logs
        }
      }
    }
    case SEARCH_FAILURE: {
      return {
        ...state,
        ui: {
          ...state.ui,
          search: {
            ...state.ui.search,
            total: 0,
            page: 0
          }
        },
        search: {
          ...state.search,
          logs: []
        }
      }
    }
    case SEARCH_PAGE: {
      const { page } = action

      return {
        ...state,
        ui: {
          ...state.ui,
          search: {
            ...state.ui.search,
            page
          }
        }
      }
    }

    case RESOURCE_LIST_REQUEST: {
      return {
        ...state,
        ui: {
          ...state.ui,
          resources: {
            ...state.ui.resources,
            isLoading: true
          }
        }
      }
    }
    case RESOURCE_LIST_SUCCESS: {
      const { resources } = action

      return {
        ...state,
        ui: {
          ...state.ui,
          resources: {
            ...state.ui.resources,
            isLoading: false
          }
        },
        resources
      }
    }
    case RESOURCE_LIST_FAILURE: {
      const { error } = action

      console.error(error)

      return {
        ...state,
        ui: {
          ...state.ui,
          resources: {
            ...state.ui.resources,
            isLoading: false
          }
        }
      }
    }
    case RESOURCE_CREATE_REQUEST: {
      return {
        ...state,
        ui: {
          ...state.ui,
          resources: {
            ...state.ui.resources,
            isCreating: true
          }
        }
      }
    }
    case RESOURCE_CREATE_SUCCESS: {
      const { resource } = action

      return {
        ...state,
        ui: {
          ...state.ui,
          resources: {
            ...state.ui.resources,
            isCreating: false
          }
        },
        resources: [...state.resources, resource]
      }
    }
    case RESOURCE_CREATE_FAILURE: {
      const { error } = action

      return {
        ...state,
        ui: {
          ...state.ui,
          resources: {
            ...state.ui.resources,
            isCreating: false,
            error
          }
        }
      }
    }
    case RESOURCE_CREATE_DISMISS: {
      return {
        ...state,
        ui: {
          ...state.ui,
          resources: {
            ...state.ui.resources,
            error: undefined
          }
        }
      }
    }

    default:
      return state
  }
}

