/* @flow */

import type { RawAction } from '~/types/action'

import {
  SearchChange,
  //SearchRequest,
  //SearchSuccess,
  //SearchFailure
} from '~/types/search'

export const input: RawAction<[string], void> = store => async (value) => {
  const { dispatch } = store

  dispatch(SearchChange(value))
}

export const search: RawAction<[string], any[]> = store => async (value) => {
  //const { dispatch } = store

  return []
}
