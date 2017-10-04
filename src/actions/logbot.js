/* @flow */

import type { RawAction } from '~/types/action'
import type { Log } from '~/types/logbot'

import { getUrl } from '~/types'
import {
  DateChange,
  LogRequest,
  LogSuccess,
  LogFailure
} from '~/types/logbot'
import axios from 'axios'

export const setDate: RawAction<[string], string> = store => async (date) => {
  const { dispatch } = store

  dispatch(DateChange(date))

  return date
}

export const storeLog: RawAction<[string, number], Log[]> = store => async (date, index) => {
  const { dispatch } = store

  dispatch(LogRequest(date, index))
  try {
    const apiUrl = getUrl(process.env.PROTOCOL, process.env.API_HOST, process.env.API_PORT)
    const { data: log } = await axios.get(`${apiUrl}/api/logbot/g0v.tw/${date}/${index}`)
    dispatch(LogSuccess(date, index, log))

    return log
  } catch (error) {
    dispatch(LogFailure(date, index, error))
    throw error
  }
}
