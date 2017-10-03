/* @flow */

import type { State } from '~/reducers'
import type { DropdownOption } from './semantic-ui'

export type Hashtag = {
  id: number,
  content: string
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

// functions
export const getHashtags = (state: State): { [key: number]: Hashtag } => {
  return (state && state.hashtags) || {}
}

export const getHashtag = (state: State, id: number): ?Hashtag => {
  return (state && state.hashtags && state.hashtags[id])
}

export const toDropdownOption = (hashtag: Hashtag): DropdownOption => ({
  key: hashtag.content, value: hashtag.content, text: `#${hashtag.content}`
})
