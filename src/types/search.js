/* @flow */

import type { State } from '~/reducers'
import type { Log } from './logbot'

export const ROWS_PER_PAGE = 10

// data
export type SearchResult = {
  keyword: string,
  total: number,
  logs: Log[]
}

export type G0vSearchResult = {
  source: 'logbot' | 'hackpad' | 'issues' | 'repo',
  id: string,
  title: string,
  content: string,
  url: string,
  updated_at: number,
  data: any
}

export type SearchChangeAction = { type: 'SEARCH_CHANGE', value: string }
export const SEARCH_CHANGE = 'SEARCH_CHANGE'
export const SearchChange = (value: string): SearchChangeAction => ({ type: SEARCH_CHANGE, value })

export type HintRequestAction = { type: 'HINT_REQUEST', value: string }
export const HINT_REQUEST = 'HINT_REQUEST'
export const HintRequest = (value: string): HintRequestAction => ({ type: HINT_REQUEST, value })

export type HintSuccessAction = { type: 'HINT_SUCCESS', hints: string[] }
export const HINT_SUCCESS = 'HINT_SUCCESS'
export const HintSuccess = (hints: string[]): HintSuccessAction => ({ type: HINT_SUCCESS, hints })

export type HintFailureAction = { type: 'HINT_FAILURE', error: Error }
export const HINT_FAILURE = 'HINT_FAILURE'
export const HintFailure = (error: Error): HintFailureAction => ({ type: HINT_FAILURE, error })

export type SearchRequestAction = { type: 'SEARCH_REQUEST', value: string }
export const SEARCH_REQUEST = 'SEARCH_REQUEST'
export const SearchRequest = (value: string): SearchRequestAction => ({ type: SEARCH_REQUEST, value })

export type SearchSuccessAction = { type: 'SEARCH_SUCCESS', logs: Log[], total: number }
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS'
export const SearchSuccess = (logs: Log[], total: number): SearchSuccessAction => ({ type: SEARCH_SUCCESS, logs, total })

export type SearchFailureAction = { type: 'SEARCH_FAILURE', error: Error }
export const SEARCH_FAILURE = 'SEARCH_FAILURE'
export const SearchFailure = (error: Error): SearchFailureAction => ({ type: SEARCH_FAILURE, error })

export type G0vSearchRequestAction = { type: 'G0V_SEARCH_REQUEST', text: string }
export const G0V_SEARCH_REQUEST = 'G0V_SEARCH_REQUEST'
export const G0vSearchRequest = (text: string): G0vSearchRequestAction => ({ type: G0V_SEARCH_REQUEST, text })

export type G0vSearchSuccessAction = { type: 'G0V_SEARCH_SUCCESS', text: string, result: G0vSearchResult[], total: number }
export const G0V_SEARCH_SUCCESS = 'G0V_SEARCH_SUCCESS'
export const G0vSearchSuccess = (text: string, result: G0vSearchResult[], total: number): G0vSearchSuccessAction => ({ type: G0V_SEARCH_SUCCESS, text, result, total })

export type G0vSearchFailureAction = { type: 'G0V_SEARCH_FAILURE', text: string, error: Error }
export const G0V_SEARCH_FAILURE = 'G0V_SEARCH_FAILURE'
export const G0vSearchFailure = (text: string, error: Error): G0vSearchFailureAction => ({ type: G0V_SEARCH_FAILURE, text, error })

export type SearchPageAction = { type: 'SEARCH_PAGE', page: number }
export const SEARCH_PAGE = 'SEARCH_PAGE'
export const SearchPage = (page: number): SearchPageAction => ({ type: SEARCH_PAGE, page })

// functions
export const getSearch = (state: State): any => {
  return (state && state.ui && state.ui.search) || {}
}

export const query = (query: string, from: number): any =>
  ({
    query: {
      query_string: {
        query
      }
    },
    from,
    highlight: {
      fields: {
        content: {}
      }
    },
    aggs: {
      source_count: {
        terms: {
          field: 'source'
        }
      }
    },
    sort: [{ updated_at: 'desc' }]
  })
