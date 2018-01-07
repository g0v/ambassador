/* @flow */

// data
export type ConfigTokenRequestAction = { type: 'CONFIG_TOKEN_REQUEST', email: string, token: string }
export const CONFIG_TOKEN_REQUEST = 'CONFIG_TOKEN_REQUEST'
export const ConfigTokenRequest = (email: string, token: string): ConfigTokenRequestAciton => ({ type: CONFIG_TOKEN_REQUEST, email, token })

export type ConfigTokenSuccessAction = { type: 'CONFIG_TOKEN_SUCCESS', email: string, token: string }
export const CONFIG_TOKEN_SUCCESS = 'CONFIG_TOKEN_SUCCESS'
export const ConfigTokenSuccess = (email: string, token: string): ConfigTokenSuccessAction => ({ type: CONFIG_TOKEN_SUCCESS, email, token })

export type ConfigTokenFailureAction = { type: 'CONFIG_TOKEN_FAILURE', email: string, token: string, error: Error }
export const CONFIG_TOKEN_FAILURE = 'CONFIG_TOKEN_FAILURE'
export const ConfigTokenFailure = (email:string, token: string, error: Error): ConfigTokenFailureAction => ({ type: CONFIG_TOKEN_FAILURE, email, token, error })
