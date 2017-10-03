/* @flow */

import type { RawAction } from '~/types/action'
import type { Hashtag } from '~/types/hashtag'

import { getUrl } from '~/types'
import * as H from '~/types/hashtag'
import axios from 'axios'

export const getHashtags: RawAction<[], { [key: number]: Hashtag }> = store => async () => {
  const { dispatch, getState } = store

  dispatch(H.HashtagListRequest())
  try {
    const apiUrl = getUrl(process.env.PROTOCOL, process.env.API_HOST, process.env.API_PORT)
    const { data: hashtags } = await axios.get(`${apiUrl}/api/hashtag`)
    dispatch(H.HashtagListSuccess(hashtags))
  } catch (error) {
    dispatch(H.HashtagListFailure(error))
    throw error
  }

  return H.getHashtags(getState())
}
