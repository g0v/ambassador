/* @flow */

import type { RawAction } from '~/types/action'
import type { Hashtag } from '~/types/hashtag'

import { getUrl } from '~/types'
import * as H from '~/types/hashtag'
import axios from 'axios'
import uuid from 'uuid'

const apiUrl = getUrl(process.env.PROTOCOL, process.env.API_HOST, process.env.API_PORT)

let lastHashtags = Promise.resolve({})
export const getHashtags: RawAction<[], { [key: number]: Hashtag }> = store => async () => {
  const { dispatch, getState } = store

  dispatch(H.HashtagListRequest())
  try {
    lastHashtags = axios.get(`${apiUrl}/api/hashtag`).then(r => r.data)
    const hashtags = await lastHashtags
    dispatch(H.HashtagListSuccess(hashtags))
  } catch (error) {
    dispatch(H.HashtagListFailure(error))
    throw error
  }

  return H.getHashtags(getState())
}

export const getStoredHashtags: RawAction<[], { [key: number]: Hashtag }> = store => async () =>
  lastHashtags

let lastCreatedHashtag = Promise.resolve()
export const createHashtag: RawAction<[string], Hashtag> = store => async (content) => {
  const { dispatch } = store
  const id = uuid.v4()
  const tag = { id, content }

  dispatch(H.HashtagCreateRequest(tag))
  try {
    lastCreatedHashtag = axios.post(`${apiUrl}/api/hashtag/${content}`).then(r => r.data)
    const tag = await lastCreatedHashtag
    dispatch(H.HashtagCreateSuccess(id, { id: tag.id, content }))

    return tag
  } catch (error) {
    dispatch(H.HashtagCreateFailure(tag, error))
    throw error
  }
}

export const getLastCreatedHashtag: RawAction<[], ?Hashtag> = store => async () =>
  lastCreatedHashtag
