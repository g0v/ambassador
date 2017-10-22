/* @flow */

import type { State } from '~/reducers'
import type { HashtagId } from './hashtag'

export const DATE_FORMAT = 'YYYY-MM-DD'

export const TIME_FORMAT = 'HH:mm'

export type LogId = number

export type Log = {
  id?: LogId,
  date: string,
  index: number,
  time?: string,
  nick?: string,
  msg?: string,
  hashtags?: number[]
}

export type HashtagLink = {
  id: number,
  log: LogId,
  hashtag: HashtagId
}

// data
export type LogRequestAction = { type: 'LOG_REQUEST', date: string, index: number }
export const LOG_REQUEST = 'LOG_REQUEST'
export const LogRequest = (date: string, index: number): LogRequestAction => ({ type: LOG_REQUEST, date, index })

export type LogSuccessAction = { type: 'LOG_SUCCESS', date: string, index: number, log: Log }
export const LOG_SUCCESS = 'LOG_SUCCESS'
export const LogSuccess = (date: string, index: number, log: Log): LogSuccessAction => ({ type: LOG_SUCCESS, date, index, log })

export type LogFailureAction = { type: 'LOG_FAILURE', date: string, index: number, error: Error }
export const LOG_FAILURE = 'LOG_FAILURE'
export const LogFailure = (date: string, index: number, error: Error): LogFailureAction => ({ type: LOG_FAILURE, date, index, error })

export type LinkRequestAction = { type: 'LOG_LINK_REQUEST', logId: LogId, hashtagId: HashtagId }
export const LOG_LINK_REQUEST = 'LOG_LINK_REQUEST'
export const LinkRequest = (logId: LogId, hashtagId: HashtagId): LinkRequestAction => ({ type: LOG_LINK_REQUEST, logId, hashtagId })

export type LinkSuccessAction = { type: 'LOG_LINK_SUCCESS', logId: LogId, hashtagId: HashtagId }
export const LOG_LINK_SUCCESS = 'LOG_LINK_SUCCESS'
export const LinkSuccess = (logId: LogId, hashtagId: HashtagId): LinkSuccessAction => ({ type: LOG_LINK_SUCCESS, logId, hashtagId })

export type LinkFailureAction = { type: 'LOG_LINK_FAILURE', logId: LogId, hashtagId: HashtagId, error: Error }
export const LOG_LINK_FAILURE = 'LOG_LINK_FAILURE'
export const LinkFailure = (logId: LogId, hashtagId: HashtagId, error: Error): LinkFailureAction => ({ type: LOG_LINK_FAILURE, logId, hashtagId, error })

export type UnlinkRequestAction = { type: 'LOG_UNLINK_REQUEST', logId: LogId, hashtagId: HashtagId }
export const LOG_UNLINK_REQUEST = 'LOG_UNLINK_REQUEST'
export const UnlinkRequest = (logId: LogId, hashtagId: HashtagId): UnlinkRequestAction => ({ type: LOG_UNLINK_REQUEST, logId, hashtagId })

export type UnlinkSuccessAction = { type: 'LOG_UNLINK_SUCCESS', logId: LogId, hashtagId: HashtagId }
export const LOG_UNLINK_SUCCESS = 'LOG_UNLINK_SUCCESS'
export const UnlinkSuccess = (logId: LogId, hashtagId: HashtagId): UnlinkSuccessAction => ({ type: LOG_UNLINK_SUCCESS, logId, hashtagId })

export type UnlinkFailureAction = { type: 'LOG_UNLINK_FAILURE', logId: LogId, hashtagId: HashtagId, error: Error }
export const LOG_UNLINK_FAILURE = 'LOG_UNLINK_FAILURE'
export const UnlinkFailure = (logId: LogId, hashtagId: HashtagId, error: Error): UnlinkFailureAction => ({ type: LOG_UNLINK_FAILURE, logId, hashtagId, error })

export type HideAction = { type: 'LOG_HIDE', date: string, index: number }
export const LOG_HIDE = 'LOG_HIDE'
export const Hide = (date: string, index: number): HideAction => ({ type: LOG_HIDE, date, index })

// functions
export const getLogs = (state: State): Log[] => {
  return (state && state.logbot && state.logbot.logs) || []
}
