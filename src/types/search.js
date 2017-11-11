/* @flow */

// data
export type SearchChangeAction = { type: 'SEARCH_CHANGE', value: string }
export const SEARCH_CHANGE = 'SEARCH_CHANGE'
export const SearchChange = (value: string): SearchChangeAction => ({ type: SEARCH_CHANGE, value })

export type SearchRequestAction = { type: 'SEARCH_REQUEST', value: string }
export const SEARCH_REQUEST = 'SEARCH_REQUEST'
export const SearchRequest = (value: string): SearchRequestAction => ({ type: SEARCH_REQUEST, value })

export type SearchSuccessAction = { type: 'SEARCH_SUCCESS', logs: any[] }
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS'
export const SearchSuccess = (logs: any[]): SearchSuccessAction => ({ type: SEARCH_SUCCESS, logs })

export type SearchFailureAction = { type: 'SEARCH_FAILURE', error: Error }
export const SEARCH_FAILURE = 'SEARCH_FAILURE'
export const SearchFailure = (error: Error): SearchFailureAction => ({ type: SEARCH_FAILURE, error })
