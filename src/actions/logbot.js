/* @flow */

import type { RawAction } from '~/types/action'
import type { Log, LogContent } from '~/types/logbot'

import { getUrl } from '~/types'
import {
  DateChange,
  LogPush,
  LogRequest,
  LogSuccess,
  LogFailure,
  LogUpdate,
  getLogContents
} from '~/types/logbot'
import axios from 'axios'

export const setDate: RawAction<[string], string> = store => async (date) => {
  const { dispatch } = store

  dispatch(DateChange(date))

  return date
}

export const pushLog: RawAction<[string, number], Log> = store => async (date, index) => {
  const { dispatch } = store

  dispatch(LogPush(date, index))

  return { date, index }
}

export const getLogs: RawAction<[string], LogContent[]> = store => async (date) => {
  const { dispatch, getState } = store
  const state = getState()
  const logs = getLogContents(state, date)

  if (logs) {
    return logs
  }

  dispatch(LogRequest(date))
  try {
    const apiUrl = getUrl(process.env.PROTOCOL, process.env.API_HOST, process.env.API_PORT)
    const { data: logs } = await axios.get(`${apiUrl}/api/logbot/g0v.tw/${date}`)
    dispatch(LogSuccess(date, logs))

    return logs
  } catch (error) {
    dispatch(LogFailure(date, error))
    throw error
  }
}

export const updateLog: RawAction<[string, number, LogContent], Log> = store => async (date, index, log) => {
  const { dispatch } = store

  dispatch(LogUpdate(date, index, log))

  return { date, index, ...log }
}

export const storeLog: RawAction<[string, number], Log> = store => async (date, index) => {
  const { dispatch } = store

  // $FlowFixMe
  await dispatch(pushLog)(date, index)
  // $FlowFixMe
  const logs = await dispatch(getLogs)(date)
  // $FlowFixMe
  const log = await dispatch(updateLog)(date, index, logs[index])

  const apiUrl = getUrl(process.env.PROTOCOL, process.env.API_HOST, process.env.API_PORT)
  let r
  r = await axios.post(`${apiUrl}/api/logbot/g0v.tw/${date}/${index}`)
  console.log('create log', r)
  r = await axios.post(`${apiUrl}/api/hashtag/g0v%2FLogbot`)
  console.log('create hashtag', r)

  return log
}
