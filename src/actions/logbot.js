/* @flow */

import type { RawAction } from '~/types/action'
import type { LogId, Log, HashtagLink } from '~/types/logbot'
import type { HashtagId } from '~/types/hashtag'

import * as A from '~/types/auth'
import { getUrl } from '~/types'
import {
  LogRequest,
  LogSuccess,
  LogFailure,
  LogStore,
  LinkRequest,
  LinkSuccess,
  LinkFailure,
  UnlinkRequest,
  UnlinkSuccess,
  UnlinkFailure,
  Hide
} from '~/types/logbot'
import axios from 'axios'

const apiUrl = getUrl(process.env.PROTOCOL, process.env.API_HOST, process.env.API_PORT)

export const getLog: RawAction<[string, number], Log> = store => async (date, index) => {
  const { dispatch } = store

  dispatch(LogRequest(date, index))
  try {
    const { data: log } = await axios.get(`${apiUrl}/api/logbot/g0v.tw/${date}/${index}`)
    dispatch(LogSuccess(date, index, log))

    return log
  } catch (error) {
    dispatch(LogFailure(date, index, error))
    throw error
  }
}

export const storeLog: RawAction<[string, number], Log> = store => async (date, index) => {
  const { dispatch, getState } = store

  const token = A.getAccessToken(getState())
  if (!token) {
    throw new Error('access token not found')
  }

  try {
    await axios.post(`${apiUrl}/api/logbot/g0v.tw/${date}/${index}`, { token })
  } catch (error) {
    if (error.response) {
      const { status } = error.response
      if (status !== 409) {
        console.error(error)
      }
    }
  }

  dispatch(LogStore(date, index))
  // $FlowFixMe
  return dispatch(getLog)(date, index)
}

export const linkHashtag: RawAction<[LogId, HashtagId], HashtagLink> = store => async (logId, hashtagId) => {
  const { dispatch, getState } = store

  const token = A.getAccessToken(getState())
  if (!token) {
    throw new Error('access token not found')
  }

  dispatch(LinkRequest(logId, hashtagId))
  try {
    const { data: link } = await axios.post(`${apiUrl}/api/log/${logId}/hashtag/${hashtagId}`, { token })
    dispatch(LinkSuccess(logId, hashtagId))

    return link
  } catch (error) {
    dispatch(LinkFailure(logId, hashtagId, error))
    throw error
  }
}

export const unlinkHashtag: RawAction<[LogId, HashtagId], void> = store => async (logId, hashtagId) => {
  const { dispatch, getState } = store

  const token = A.getAccessToken(getState())
  if (!token) {
    throw new Error('access token not found')
  }

  dispatch(UnlinkRequest(logId, hashtagId))
  try {
    const { data: link } =
      await axios.delete(
        `${apiUrl}/api/log/${logId}/hashtag/${hashtagId}`,
        // use data to set the DELETE request body
        { data: { token } }
      )
    dispatch(UnlinkSuccess(logId, hashtagId))

    return link
  } catch (error) {
    dispatch(UnlinkFailure(logId, hashtagId, error))
    throw error
  }
}

export const hide: RawAction<[string, number], void> = store => async(date, index) => {
  const { dispatch } = store

  dispatch(Hide(date, index))
}
