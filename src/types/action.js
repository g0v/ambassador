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
  RepoListFailureAction,
  IssueListRequestAction,
  IssueListSuccessAction,
  IssueListFailureAction
} from './github'
import type {
  DateChangeAction
} from './logbot'
import { map as _map } from 'ramda'

export type PlainAction
  = LoginRequestAction | LoginSuccessAction | LoginFailureAction
  | LogoutAction
  | ProfileRequestAction | ProfileSuccessAction | ProfileFailureAction
  | MemberRequestAction | MemberSuccessAction | MemberFailureAction
  | RepoListRequestAction | RepoListSuccessAction | RepoListFailureAction
  | IssueListRequestAction | IssueListSuccessAction | IssueListFailureAction
  | DateChangeAction

export type Action<As: $ReadOnlyArray<mixed>, B> = (...args: As) => Promise<B>
export type RawAction<As: $ReadOnlyArray<mixed>, B> = Store => Action<As, B>
export type ActionMap = Action<$ReadOnlyArray<mixed>, any> | { [key: string]: ActionMap }
export type RawActionMap = RawAction<$ReadOnlyArray<mixed>, any> | { [key: string]: RawActionMap }

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
