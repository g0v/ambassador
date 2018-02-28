/* @flow */

import type { State } from '~/reducers'

export type Statistics = {
  taggedLogs: number,
  taggedResources: number
}

// data
export type StatisticsRequestAction = { type: 'STATISTICS_REQUEST' }
export const STATISTICS_REQUEST = 'STATISTICS_REQUEST'
export const StatisticsRequest = (): StatisticsRequestAction => ({ type: STATISTICS_REQUEST })

export type StatisticsSuccessAction = { type: 'STATISTICS_SUCCESS', statistics: Statistics }
export const STATISTICS_SUCCESS = 'STATISTICS_SUCCESS'
export const StatisticsSuccess = (statistics: Statistics): StatisticsSuccessAction => ({ type: STATISTICS_SUCCESS, statistics })

export type StatisticsFailureAction = { type: 'STATISTICS_FAILURE' }
export const STATISTICS_FAILURE = 'STATISTICS_FAILURE'
export const StatisticsFailure = (error: Error): StatisticsFailureAction => ({ type: STATISTICS_FAILURE, error })

export const EmptyStatistics: Statistics = {
  taggedLogs: 0,
  taggedResources: 0
}

// functions
export const getUrl = (protocol: ?string, host: ?string, port: ?string): string => {
  protocol = protocol || 'http'
  host = host || 'localhost'
  port = port || '80'
  let url = protocol + '://' + host
  if ((protocol === 'http' && port !== '80') || (protocol === 'https' && port !== '443')) {
    url += ':' + port
  }
  return url
}

export const getStatistics = (state: State): Statistics =>
  (state && state.statistics) || EmptyStatistics
