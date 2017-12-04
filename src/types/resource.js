/* @flow */

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
