/* @flow */

import type { RawAction } from '~/types/action'
import type { ResourceId, Resource } from '~/types/resource'
import type { HashtagId } from '~/types/hashtag'

import { getUrl } from '~/types'
import * as A from '~/types/auth'
import {
  ResourceListRequest,
  ResourceListSuccess,
  ResourceListFailure,
  ResourceRequest,
  ResourceSuccess,
  ResourceFailure,
  ResourceCreateRequest,
  ResourceCreateSuccess,
  ResourceCreateFailure,
  ResourceCreateDismiss,
  ResourceCreateLink,
  ResourceChange
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

export const get: RawAction<[ResourceId], Resource> = store => async (id) => {
  const { dispatch } = store

  dispatch(ResourceRequest(id))
  try {
    const { data: resource } = await axios.get(`${apiUrl}/api/resource/${id}`)
    dispatch(ResourceSuccess(resource))

    return resource
  } catch (error) {
    dispatch(ResourceFailure(error))
    throw error
  }
}

export const create: RawAction<[string, HashtagId[]], Resource> = store => async (uri, hashtags) => {
  const { dispatch, getState } = store

  const token = A.getAccessToken(getState())
  if (!token) {
    throw new Error('access token not found')
  }

  dispatch(ResourceCreateRequest())
  try {
    const { data: resource } = await axios.post(`${apiUrl}/api/resource`, { token, uri, hashtags })
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

export const createLink: RawAction<[HashtagId[]], void> = store => async (hashtags) => {
  const { dispatch } = store

  dispatch(ResourceCreateLink(hashtags))
}

export const change: RawAction<[string], void> = store => async (uri) => {
  const { dispatch } = store

  dispatch(ResourceChange(uri))
}
