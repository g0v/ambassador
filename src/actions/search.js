/* @flow */

import type { RawAction } from '~/types/action'
import type { Log } from '~/types/logbot'

import { getUrl } from '~/types'
import {
  SearchChange,
  HintRequest,
  HintSuccess,
  HintFailure,
  SearchRequest,
  SearchSuccess,
  SearchFailure,
  getSearch
} from '~/types/search'
import axios from 'axios'

const apiUrl = getUrl(process.env.PROTOCOL, process.env.API_HOST, process.env.API_PORT)

export const change: RawAction<[string], void> = store => async (value) => {
  const { dispatch } = store

  dispatch(SearchChange(value))
}

export const hint: RawAction<[], string[]> = store => async () => {
  const { dispatch, getState } = store
  const { value } = getSearch(getState())

  if (!value) {
    dispatch(HintSuccess([]))

    return []
  }

  dispatch(HintRequest(value))
  try {
    const { data: hints } = await axios.get(`${apiUrl}/api/hint?q=${value}`)
    dispatch(HintSuccess(hints))

    return hints
  } catch (error) {
    dispatch(HintFailure(error))
    throw error
  }
}

export const search: RawAction<[string], Log[]> = store => async (value) => {
  const { dispatch } = store

  dispatch(SearchRequest(value))
  try {
    const { data: result } = await axios.get(`${apiUrl}/api/search?q=${value}`)
    dispatch(SearchSuccess(result.logs))

    return result.logs
  } catch (error) {
    dispatch(SearchFailure(error))
    throw error
  }
}
