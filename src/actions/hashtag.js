/* @flow */

import type { RawAction } from '~/types/action'
import type { Hashtag } from '~/types/hashtag'

import { getUrl } from '~/types'
import * as H from '~/types/hashtag'
import axios from 'axios'
import uuid from 'uuid'

const apiUrl = getUrl(process.env.PROTOCOL, process.env.API_HOST, process.env.API_PORT)

export const getHashtags: RawAction<[], { [key: number]: Hashtag }> = store => async () => {
  const { dispatch, getState } = store

  dispatch(H.HashtagListRequest())
  try {
    const { data: hashtags } = await axios.get(`${apiUrl}/api/hashtag`)
    dispatch(H.HashtagListSuccess(hashtags))
  } catch (error) {
    dispatch(H.HashtagListFailure(error))
    throw error
  }

  return H.getHashtags(getState())
}

export const createHashtag: RawAction<[string], Hashtag> = store => async (content) => {
  const { dispatch } = store
  const id = uuid.v4()
  const tag = { id, content }

  dispatch(H.HashtagCreateRequest(tag))
  try {
    const { data: tag } = await axios.post(`${apiUrl}/api/hashtag/${content}`)
    dispatch(H.HashtagCreateSuccess(id, { id: tag.id, content }))

    return tag
  } catch (error) {
    dispatch(H.HashtagCreateFailure(tag, error))
    throw error
  }
}
