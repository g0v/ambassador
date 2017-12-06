/* @flow */

import type { RawAction } from '~/types/action'
import type { Resource } from '~/types/resource'

import { getUrl } from '~/types'
import {
  ResourceListRequest,
  ResourceListSuccess,
  ResourceListFailure,
  ResourceCreateRequest,
  ResourceCreateSuccess,
  ResourceCreateFailure,
  ResourceCreateDismiss
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

export const create: RawAction<[string], Resource> = store => async (uri) => {
  const { dispatch } = store

  dispatch(ResourceCreateRequest())
  try {
    const { data: resource } = await axios.post(`${apiUrl}/api/resource`, { uri })
    dispatch(ResourceCreateSuccess(resource))

    return resource
  } catch (error) {
    dispatch(ResourceCreateFailure(error))
    throw error
  }
}

export const dismiss: RawAction<[], void> = store => async () => {
  const { dispatch } = store

  dispatch(ResourceCreateDismiss())
}
