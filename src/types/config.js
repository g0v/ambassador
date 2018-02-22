/* @flow */

import type { State } from '~/reducers'

// data
export type ConfigTokenRequestAction = { type: 'CONFIG_TOKEN_REQUEST', token: string }
export const CONFIG_TOKEN_REQUEST = 'CONFIG_TOKEN_REQUEST'
export const ConfigTokenRequest = (token: string): ConfigTokenRequestAction => ({ type: CONFIG_TOKEN_REQUEST, token })

export type ConfigTokenSuccessAction = { type: 'CONFIG_TOKEN_SUCCESS', token: string }
export const CONFIG_TOKEN_SUCCESS = 'CONFIG_TOKEN_SUCCESS'
export const ConfigTokenSuccess = (token: string): ConfigTokenSuccessAction => ({ type: CONFIG_TOKEN_SUCCESS, token })

export type ConfigTokenFailureAction = { type: 'CONFIG_TOKEN_FAILURE', token: string, error: Error }
export const CONFIG_TOKEN_FAILURE = 'CONFIG_TOKEN_FAILURE'
export const ConfigTokenFailure = (token: string, error: Error): ConfigTokenFailureAction => ({ type: CONFIG_TOKEN_FAILURE, token, error })

// functions
export const isUpdatingToken = (state: State): boolean => {
  return state && state.ui && state.ui.config && state.ui.config.isLoading
}
