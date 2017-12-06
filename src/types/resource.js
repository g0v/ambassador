/* @flow */

import type { State } from '~/reducers'
import type { Hashtag } from '~/hashtag'

export type Resource = {
  id: number,
  uri: string
}

// data
export type ResourceListRequestAction = { type: 'RESOURCE_LIST_REQUEST' }
export const RESOURCE_LIST_REQUEST = 'RESOURCE_LIST_REQUEST'
export const ResourceListRequest = (): ResourceListRequestAction => ({ type: RESOURCE_LIST_REQUEST })

export type ResourceListSuccessAction = { type: 'RESOURCE_LIST_SUCCESS', resources: Resource[] }
export const RESOURCE_LIST_SUCCESS = 'RESOURCE_LIST_SUCCESS'
export const ResourceListSuccess = (resources: Resource[]): ResourceListSuccessAction => ({ type: RESOURCE_LIST_SUCCESS, resources })

export type ResourceListFailureAction = { type: 'RESOURCE_LIST_FAILURE', error: Error }
export const RESOURCE_LIST_FAILURE = 'RESOURCE_LIST_FAILURE'
export const ResourceListFailure = (error: Error): ResourceListFailureAction => ({ type: RESOURCE_LIST_FAILURE, error })

export type ResourceCreateRequestAction = { type: 'RESOURCE_CREATE_REQUEST' }
export const RESOURCE_CREATE_REQUEST = 'RESOURCE_CREATE_REQUEST'
export const ResourceCreateRequest = (): ResourceCreateRequestAction => ({ type: RESOURCE_CREATE_REQUEST })

export type ResourceCreateSuccessAction = { type: 'RESOURCE_CREATE_SUCCESS', resource: Resource }
export const RESOURCE_CREATE_SUCCESS = 'RESOURCE_CREATE_SUCCESS'
export const ResourceCreateSuccess = (resource: Resource): ResourceCreateSuccessAction => ({ type: RESOURCE_CREATE_SUCCESS, resource })

export type ResourceCreateFailureAction = { type: 'RESOURCE_CREATE_FAILURE', error: Error }
export const RESOURCE_CREATE_FAILURE = 'RESOURCE_CREATE_FAILURE'
export const ResourceCreateFailure = (error: Error): ResourceCreateFailureAction => ({ type: RESOURCE_CREATE_FAILURE, error })

export type ResourceCreateDismissAction = { type: 'RESOURCE_CREATE_DISMISS' }
export const RESOURCE_CREATE_DISMISS = 'RESOURCE_CREATE_DISMISS'
export const ResourceCreateDismiss = (): ResourceCreateDismissAction => ({ type: RESOURCE_CREATE_DISMISS })

export type ResourceCreateLinkAction = { type: 'RESOURCE_CREATE_LINK', hashtags: $PropertyType<Hashtag, 'id'>[] }
export const RESOURCE_CREATE_LINK = 'RESOURCE_CREATE_LINK'
export const ResourceCreateLink = (hashtags): ResourceCreateLinkAction => ({ type: RESOURCE_CREATE_LINK, hashtags })

// functions
export const isLoading = (state: State): boolean =>
  (state && state.ui && state.ui.resources && state.ui.resources.isLoading)

export const isCreating = (state: State): boolean =>
  (state && state.ui && state.ui.resources && state.ui.resources.isCreating)

export const getResources = (state: State): Resource[] =>
  (state && state.resources) || []

export const getError = (state: State): ?Error =>
  (state && state.ui && state.ui.resources && state.ui.resources.error)

export const getHashtags = (state: State): $PropertyType<Hashtag, 'id'>[] =>
  (state && state.ui && state.ui.resources && state.ui.resources.hashtags) || []
