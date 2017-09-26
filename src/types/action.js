/* @flow */

import type { Dispatch } from 'redux'
import type { Store } from '~/store'
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
import { map as _map } from 'ramda'

export type NopAction = { type: 'NOP' }
export const NOP = 'NOP'
export const Nop = (): NopAction => ({ type: NOP })

export type PlainAction
  = NopAction
  | LoginRequestAction | LoginSuccessAction | LoginFailureAction
  | LogoutAction
  | ProfileRequestAction | ProfileSuccessAction | ProfileFailureAction
  | MemberRequestAction | MemberSuccessAction | MemberFailureAction
  | RepoListRequestAction | RepoListSuccessAction | RepoListFailureAction

export type Action<A, B> = A => Promise<B>
export type RawAction<A, B> = Store => Action<A, B>
export type ActionMap = Action<any, any> | { [key: string]: ActionMap }
export type RawActionMap = RawAction<any, any> | { [key: string]: RawActionMap }

const map = (f: RawActionMap => ActionMap, o: RawActionMap): ActionMap =>
  _map(
    v => {
      switch (typeof v) {
        case 'object': return map(f, v)
        default: return f(v)
      }
    },
    o
  )

export const mapDispatchToProps: (RawActionMap => Dispatch => ActionMap) =
  actions => dispatch => ({ actions: map(dispatch, actions) })
