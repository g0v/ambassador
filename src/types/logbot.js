/* @flow */

import type { State } from '~/reducers'

export const DATE_FORMAT = 'YYYY-MM-DD'

export type Log = {
  date: string,
  index: number,
  time?: string,
  nick?: string,
  msg?: string
}

export type LogContent = {
  time: string,
  nick: string,
  msg: string
}

// data
export type DateChangeAction = { type: 'DATE_CHANGE', date: string }
export const DATE_CHANGE = 'DATE_CHANGE'
export const DateChange = (date: string): DateChangeAction => ({ type: DATE_CHANGE, date })

export type LogPushAction = { type: 'LOG_PUSH', date: string, index: number }
export const LOG_PUSH = 'LOG_PUSH'
export const LogPush = (date: string, index: number): LogPushAction => ({ type: LOG_PUSH, date, index })

export type LogRequestAction = { type: 'LOG_REQUEST', date: string }
export const LOG_REQUEST = 'LOG_REQUEST'
export const LogRequest = (date: string): LogRequestAction => ({ type: LOG_REQUEST, date })

export type LogSuccessAction = { type: 'LOG_SUCCESS', date: string, logs: LogContent[] }
export const LOG_SUCCESS = 'LOG_SUCCESS'
export const LogSuccess = (date: string, logs: LogContent[]) => ({ type: LOG_SUCCESS, date, logs })

export type LogFailureAction = { type: 'LOG_FAILURE', date: string, error: Error }
export const LOG_FAILURE = 'LOG_FAILURE'
export const LogFailure = (date: string, error: Error) => ({ type: LOG_FAILURE, error })

export type LogUpdateAction = { type: 'LOG_UPDATE', date: string, index: number, log: LogContent }
export const LOG_UPDATE = 'LOG_UPDATE'
export const LogUpdate = (date: string, index: number, log: LogContent) => ({ type: LOG_UPDATE, date, index, log })

// functions
export const getDate = (state: State): string => {
  return (state && state.logbot && state.logbot.date) || ''
}

export const getLogs = (state: State): Log[] => {
  return (state && state.logbot && state.logbot.logs) || []
}

export const getLogContents = (state: State, date: string): ?Log[] => {
  return (state && state.logbot && state.logbot.contents && state.logbot.contents[date])
}
