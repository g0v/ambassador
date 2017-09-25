/* @flow */

import type { State } from '~/reducers'

// data
export type LoginRequestAction = { type: 'LOGIN_REQUEST' }
export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LoginRequest = ():LoginRequestAction => ({ type: LOGIN_REQUEST })

export type LoginSuccessAction = { type: 'LOGIN_SUCCESS', auth: any }
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LoginSuccess = (auth: any): LoginSuccessAction => ({ type: LOGIN_SUCCESS, auth })

export type LoginFailureAction = { type: 'LOGIN_FAILURE', error: Error }
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LoginFailure = (error: Error): LoginFailureAction => ({ type: LOGIN_FAILURE, error })

export type LogoutAction = { type: 'LOGOUT' }
export const LOGOUT = 'LOGOUT'
export const Logout = (): LogoutAction => ({ type: LOGOUT })

// functions
export const isLoggingIn = (state: State): boolean => {
  return state && state.ui && state.ui.login
}

export const getAccessToken = (state: State): string => {
  return (state && state.auth && state.auth.access_token) || ''
}
