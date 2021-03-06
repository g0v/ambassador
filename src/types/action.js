/* @flow */

import type { StoreAPI } from '~/store/app'
import type {
  StatisticsRequestAction,
  StatisticsSuccessAction,
  StatisticsFailureAction,
} from './'
import type {
  ConfigTokenRequestAction,
  ConfigTokenSuccessAction,
  ConfigTokenFailureAction
} from './config'
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
  UserRequestAction,
  UserSuccessAction,
  UserFailureAction,
  MemberRequestAction,
  MemberSuccessAction,
  MemberFailureAction,
  RepoListRequestAction,
  RepoListSuccessAction,
  RepoListFailureAction,
  RepoContributorListRequestAction,
  RepoContributorListSuccessAction,
  RepoContributorListFailureAction,
  IssueListRequestAction,
  IssueListSuccessAction,
  IssueListFailureAction,
  IntroRequestAction,
  IntroSuccessAction,
  IntroFailureAction,
  G0vJsonRequestAction,
  G0vJsonSuccessAction,
  G0vJsonFailureAction,
  GroupRequestAction,
  GroupSuccessAction,
  GroupFailureAction
} from './github'
import type {
  LogRequestAction,
  LogSuccessAction,
  LogFailureAction,
  LinkRequestAction,
  LinkSuccessAction,
  LinkFailureAction,
  UnlinkRequestAction,
  UnlinkSuccessAction,
  UnlinkFailureAction,
  HideAction
} from './logbot'
import type {
  HashtagListRequestAction,
  HashtagListSuccessAction,
  HashtagListFailureAction,
  HashtagCreateRequestAction,
  HashtagCreateSuccessAction,
  HashtagCreateFailureAction
} from './hashtag'
import type {
  SearchChangeAction,
  HintRequestAction,
  HintSuccessAction,
  HintFailureAction,
  SearchRequestAction,
  SearchSuccessAction,
  SearchFailureAction,
  G0vSearchRequestAction,
  G0vSearchSuccessAction,
  G0vSearchFailureAction,
  SearchPageAction
} from './search'
import type {
  ResourceListRequestAction,
  ResourceListSuccessAction,
  ResourceListFailureAction,
  ResourceRequestAction,
  ResourceSuccessAction,
  ResourceFailureAction,
  ResourceCreateRequestAction,
  ResourceCreateSuccessAction,
  ResourceCreateFailureAction,
  ResourceCreateDismissAction,
  ResourceCreateLinkAction,
  ResourceChangeAction
} from './resource'
import { map as _map } from 'ramda'

export type PlainAction
  = StatisticsRequestAction | StatisticsSuccessAction | StatisticsFailureAction
  | ConfigTokenRequestAction | ConfigTokenSuccessAction | ConfigTokenFailureAction
  | LoginRequestAction | LoginSuccessAction | LoginFailureAction
  | LogoutAction
  | ProfileRequestAction | ProfileSuccessAction | ProfileFailureAction
  | UserRequestAction | UserSuccessAction | UserFailureAction
  | MemberRequestAction | MemberSuccessAction | MemberFailureAction
  | RepoListRequestAction | RepoListSuccessAction | RepoListFailureAction
  | RepoContributorListRequestAction | RepoContributorListSuccessAction | RepoContributorListFailureAction
  | IssueListRequestAction | IssueListSuccessAction | IssueListFailureAction
  | IntroRequestAction | IntroSuccessAction | IntroFailureAction
  | G0vJsonRequestAction | G0vJsonSuccessAction | G0vJsonFailureAction
  | LogRequestAction | LogSuccessAction | LogFailureAction
  | LinkRequestAction | LinkSuccessAction | LinkFailureAction
  | UnlinkRequestAction | UnlinkSuccessAction | UnlinkFailureAction
  | HideAction
  | HashtagListRequestAction | HashtagListSuccessAction | HashtagListFailureAction
  | HashtagCreateRequestAction | HashtagCreateSuccessAction | HashtagCreateFailureAction
  | SearchChangeAction
  | HintRequestAction | HintSuccessAction | HintFailureAction
  | SearchRequestAction | SearchSuccessAction | SearchFailureAction
  | G0vSearchRequestAction | G0vSearchSuccessAction | G0vSearchFailureAction
  | GroupRequestAction | GroupSuccessAction | GroupFailureAction
  | SearchPageAction
  | ResourceListRequestAction | ResourceListSuccessAction | ResourceListFailureAction
  | ResourceRequestAction | ResourceSuccessAction | ResourceFailureAction
  | ResourceCreateRequestAction | ResourceCreateSuccessAction | ResourceCreateFailureAction | ResourceCreateDismissAction
  | ResourceCreateLinkAction
  | ResourceChangeAction

export type Action<As, B> = (...args: As) => Promise<B>
export type RawAction<As, B> = StoreAPI => Action<As, B>
export type ActionMap = Action<*, *> | { [key: string]: ActionMap }
export type RawActionMap = RawAction<*, *> | { [key: string]: RawActionMap }

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

export const mapDispatchToProps: (RawActionMap => (RawActionMap => ActionMap) => ActionMap) =
  actions => dispatch => ({ actions: map(dispatch, actions) })
