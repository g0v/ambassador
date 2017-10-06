/* @flow */

import type { State } from '~/reducers'

// use uuid string as pseudo id before request success
export type HashtagId = number | string

export type Hashtag = {
  id: HashtagId,
  content: string
}

export type HashtagOption = {
  key: HashtagId,
  value: HashtagId,
  text: $PropertyType<Hashtag, 'content'>
}

// data
export type HashtagListRequestAction = { type: 'HASHTAG_LIST_REQUEST' }
export const HASHTAG_LIST_REQUEST = 'HASHTAG_LIST_REQUEST'
export const HashtagListRequest = (): HashtagListRequestAction => ({ type: HASHTAG_LIST_REQUEST })

export type HashtagListSuccessAction = { type: 'HASHTAG_LIST_SUCCESS', hashtags: Hashtag[] }
export const HASHTAG_LIST_SUCCESS = 'HASHTAG_LIST_SUCCESS'
export const HashtagListSuccess = (hashtags: Hashtag[]): HashtagListSuccessAction => ({ type: HASHTAG_LIST_SUCCESS, hashtags })

export type HashtagListFailureAction = { type: 'HASHTAG_LIST_FAILURE', error: Error }
export const HASHTAG_LIST_FAILURE = 'HASHTAG_LIST_FAILURE'
export const HashtagListFailure = (error: Error): HashtagListFailureAction => ({ type: HASHTAG_LIST_FAILURE, error })

export type HashtagCreateRequestAction = { type: 'HASHTAG_CREATE_REQUEST', tag: Hashtag }
export const HASHTAG_CREATE_REQUEST = 'HASHTAG_CREATE_REQUEST'
export const HashtagCreateRequest = (tag: Hashtag): HashtagCreateRequestAction => ({ type: HASHTAG_CREATE_REQUEST, tag })

export type HashtagCreateSuccessAction = { type: 'HASHTAG_CREATE_SUCCESS', id: HashtagId, tag: Hashtag }
export const HASHTAG_CREATE_SUCCESS = 'HASHTAG_CREATE_SUCCESS'
export const HashtagCreateSuccess = (id: $PropertyType<Hashtag, 'id'>, tag: Hashtag): HashtagCreateSuccessAction => ({ type: HASHTAG_CREATE_SUCCESS, id, tag })

export type HashtagCreateFailureAction = { type: 'HASHTAG_CREATE_FAILURE', tag: Hashtag, error: Error }
export const HASHTAG_CREATE_FAILURE = 'HASHTAG_CREATE_FAILURE'
export const HashtagCreateFailure = (tag: Hashtag, error: Error) => ({ type: HASHTAG_CREATE_FAILURE, tag, error })

// functions
export const getHashtags = (state: State): { [key: number]: Hashtag } => {
  return (state && state.hashtags) || {}
}

export const getHashtag = (state: State, id: number): ?Hashtag => {
  return (state && state.hashtags && state.hashtags[id])
}

export const toDropdownOption = (hashtag: Hashtag): HashtagOption => ({
  key: hashtag.id, value: hashtag.id, text: `#${hashtag.content}`
})
