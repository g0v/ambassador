/* @flow */

// data
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

export type SearchSuccessAction = { type: 'SEARCH_SUCCESS', logs: any[] }
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS'
export const SearchSuccess = (logs: any[]): SearchSuccessAction => ({ type: SEARCH_SUCCESS, logs })

export type SearchFailureAction = { type: 'SEARCH_FAILURE', error: Error }
export const SEARCH_FAILURE = 'SEARCH_FAILURE'
export const SearchFailure = (error: Error): SearchFailureAction => ({ type: SEARCH_FAILURE, error })

// functions
export const getSearch = (state: State): any => {
  return (state && state.ui && state.ui.search) || {}
}
