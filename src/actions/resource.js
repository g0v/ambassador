/* @flow */

import type { RawAction } from '~/types/action'
import type { Resource } from '~/types/resource'

import { getUrl } from '~/types'
import {
  ResourceListRequest,
  ResourceListSuccess,
  ResourceListFailure
} from '~/types/resource'
import axios from 'axios'

const apiUrl = getUrl(process.env.PROTOCOL, process.env.API_HOST, process.env.API_PORT)

export const list: RawAction<[], Resource[]> = store => async () => {
  const { dispatch } = store

  dispatch(ResourceListRequest())
  try {
    const { data: resources } = await axios.get(`${apiUrl}/api/resource`)
    dispatch(ResourceListSuccess(resources))

    return resources
  } catch (error) {
    dispatch(ResourceListFailure(error))
    throw error
  }
}
