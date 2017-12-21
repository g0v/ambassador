/* @flow */

import type { RawAction } from '~/types/action'
import type { SearchResult } from '~/types/search'

import { getUrl } from '~/types'
import {
  ROWS_PER_PAGE,
  SearchChange,
  HintRequest,
  HintSuccess,
  HintFailure,
  SearchRequest,
  SearchSuccess,
  SearchFailure,
  G0vSearchRequest,
  G0vSearchSuccess,
  G0vSearchFailure,
  SearchPage,
  getSearch,
  query
} from '~/types/search'
import { map } from 'ramda'
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

export const search: RawAction<[string, number], SearchResult> = store => async (value, page = 0) => {
  const { dispatch } = store
  const limit = ROWS_PER_PAGE
  const offset = page * ROWS_PER_PAGE

  dispatch(SearchRequest(value))
  try {
    const { data: result } = await axios.get(`${apiUrl}/api/search?q=${value}&limit=${limit}&offset=${offset}`)
    dispatch(SearchSuccess(result.logs, result.total))

    return result
  } catch (error) {
    dispatch(SearchFailure(error))
    throw error
  }
}

export const g0vSearch: RawAction<[string, number], any[]> = store => async (text, page = 0) => {
  const { dispatch } = store
  const offset = page * ROWS_PER_PAGE
  const q = query(text, page)

  dispatch(G0vSearchRequest(text))
  try {
    let { data: { hits: { hits: result, total } } } =
      await axios.get(`http://api.search.g0v.io/query.php?query=${encodeURIComponent(JSON.stringify(q))}`)
    result = map(e => e._source, result)

    dispatch(G0vSearchSuccess(text, result, total))

    return result
  } catch (error) {
    dispatch(G0vSearchFailure(text, error))
    throw error
  }
}

export const page: RawAction<[number], void> = store => async (page) => {
  const { dispatch } = store

  dispatch(SearchPage(page))
}
