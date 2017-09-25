/* @flow */

import type {
  LoginRequestAction,
  LoginSuccessAction,
  LoginFailureAction,
  LogoutAction
} from './auth'
import type {
  ProfileRequestAction,
  ProfileSuccessAction,
  ProfileFailureAction,
  MemberRequestAction,
  MemberSuccessAction,
  MemberFailureAction,
  RepoListRequestAction,
  RepoListSuccessAction,
  RepoListFailureAction
} from './github'

export type NopAction = { type: 'NOP' }
export const NOP = 'NOP'
export const Nop = (): NopAction => ({ type: NOP })

export type Action
  = NopAction
  | LoginRequestAction | LoginSuccessAction | LoginFailureAction
  | LogoutAction
  | ProfileRequestAction | ProfileSuccessAction | ProfileFailureAction
  | MemberRequestAction | MemberSuccessAction | MemberFailureAction
  | RepoListRequestAction | RepoListSuccessAction | RepoListFailureAction

export const getUrl = (protocol: string, host: string, port: string): string => {
  let url = protocol + '://' + host
  if ((protocol === 'http' && port !== '80') || (protocol === 'https' && port !== '443')) {
    url += ':' + port
  }
  return url
}
