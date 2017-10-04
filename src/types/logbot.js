/* @flow */

import type { State } from '~/reducers'

export const DATE_FORMAT = 'YYYY-MM-DD'

export type Log = {
  id?: number,
  date: string,
  index: number,
  time?: string,
  nick?: string,
  msg?: string,
  hashtags?: number[]
}

// data
export type DateChangeAction = { type: 'DATE_CHANGE', date: string }
export const DATE_CHANGE = 'DATE_CHANGE'
export const DateChange = (date: string): DateChangeAction => ({ type: DATE_CHANGE, date })

export type LogRequestAction = { type: 'LOG_REQUEST', date: string, index: number }
export const LOG_REQUEST = 'LOG_REQUEST'
export const LogRequest = (date: string, index: number): LogRequestAction => ({ type: LOG_REQUEST, date, index })

export type LogSuccessAction = { type: 'LOG_SUCCESS', date: string, index: number, log: Log }
export const LOG_SUCCESS = 'LOG_SUCCESS'
export const LogSuccess = (date: string, index: number, log: Log): LogSuccessAction => ({ type: LOG_SUCCESS, date, index, log })

export type LogFailureAction = { type: 'LOG_FAILURE', date: string, index: number, error: Error }
export const LOG_FAILURE = 'LOG_FAILURE'
export const LogFailure = (date: string, index: number, error: Error): LogFailureAction => ({ type: LOG_FAILURE, date, index, error })

// functions
export const getDate = (state: State): string => {
  return (state && state.logbot && state.logbot.date) || ''
}

export const getLogs = (state: State): Log[] => {
  return (state && state.logbot && state.logbot.logs) || []
}
