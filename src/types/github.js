/* @flow */

import type { State } from '~/reducers'
import type { Url, Project, GroupMap } from './metadata'

import { EmptyGroupStatus } from './metadata'
import { matchPath } from 'react-router-dom'

// type
type EMail = {
  email: string,
  primary: boolean,
  verified: boolean,
  visibility: ?string
}

// data
export type ProfileRequestAction = { type: 'PROFILE_REQUEST' }
export const PROFILE_REQUEST = 'PROFILE_REQUEST'
export const ProfileRequest = (): ProfileRequestAction => ({ type: PROFILE_REQUEST })

export type ProfileSuccessAction = { type: 'PROFILE_SUCCESS', profile: any }
export const PROFILE_SUCCESS = 'PROFILE_SUCCESS'
export const ProfileSuccess = (profile: any): ProfileSuccessAction => ({ type: PROFILE_SUCCESS, profile })

export type ProfileFailureAction = { type: 'PROFILE_FAILURE', error: Error }
export const PROFILE_FAILURE = 'PROFILE_FAILURE'
export const ProfileFailure = (error: Error): ProfileFailureAction => ({ type: PROFILE_FAILURE, error })

export type UserRequestAction = { type: 'USER_REQUEST', user: string }
export const USER_REQUEST = 'USER_REQUEST'
export const UserRequest = (user: string): UserRequestAction => ({ type: USER_REQUEST, user })

export type UserSuccessAction = { type: 'USER_SUCCESS', user: string, data: any }
export const USER_SUCCESS = 'USER_SUCCESS'
export const UserSuccess = (user: string, data: any): UserSuccessAction => ({ type: USER_SUCCESS, user, data })

export type UserFailureAction = { type: 'USER_FAILURE', user: string, error: Error }
export const USER_FAILURE = 'USER_FAILURE'
export const UserFailure = (user: string, error: Error): UserFailureAction => ({ type: USER_FAILURE, user, error })

export type MemberRequestAction = { type: 'MEMBER_REQUEST' }
export const MEMBER_REQUEST = 'MEMBER_REQUEST'
export const MemberRequest = (): MemberRequestAction => ({ type: MEMBER_REQUEST })

export type MemberSuccessAction = { type: 'MEMBER_SUCCESS' }
export const MEMBER_SUCCESS = 'MEMBER_SUCCESS'
export const MemberSuccess = (): MemberSuccessAction => ({ type: MEMBER_SUCCESS })

export type MemberFailureAction = { type: 'MEMBER_FAILURE', error: Error }
export const MEMBER_FAILURE = 'MEMBER_FAILURE'
export const MemberFailure = (error: Error): MemberFailureAction => ({ type: MEMBER_FAILURE, error })

export type RepoListRequestAction = { type: 'REPO_LIST_REQUEST' }
export const REPO_LIST_REQUEST = 'REPO_LIST_REQUEST'
export const RepoListRequest = (): RepoListRequestAction => ({ type: REPO_LIST_REQUEST })

export type RepoContributorListRequestAction = { type: 'REPO_CONTRIBUTOR_LIST_REQUEST' }
export const REPO_CONTRIBUTOR_LIST_REQUEST = 'REPO_CONTRIBUTOR_LIST_REQUEST'
export const RepoContributorListRequest = (): RepoContributorListRequestAction => ({ type: REPO_CONTRIBUTOR_LIST_REQUEST })

export type RepoContributorListSuccessAction = { type: 'REPO_CONTRIBUTOR_LIST_SUCCESS', contributors: any[] }
export const REPO_CONTRIBUTOR_LIST_SUCCESS = 'REPO_CONTRIBUTOR_LIST_SUCCESS'
export const RepoContributorListSuccess = (contributors: any[]): RepoContributorListSuccessAction => ({ type: REPO_CONTRIBUTOR_LIST_SUCCESS, contributors })

export type RepoContributorListFailureAction = { type: 'REPO_CONTRIBUTOR_LIST_FAILURE', error: Error  }
export const REPO_CONTRIBUTOR_LIST_FAILURE = 'REPO_CONTRIBUTOR_LIST_FAILURE'
export const RepoContributorListFailure = (error: Error): RepoContributorListFailureAction => ({ type: REPO_CONTRIBUTOR_LIST_FAILURE, error })

// TODO: repos: Repo[]
export type RepoListSuccessAction = { type: 'REPO_LIST_SUCCESS', repos: any[] }
export const REPO_LIST_SUCCESS = 'REPO_LIST_SUCCESS'
export const RepoListSuccess = (repos: any[]): RepoListSuccessAction => ({ type: REPO_LIST_SUCCESS, repos })

export type RepoListFailureAction = { type: 'REPO_LIST_FAILURE', error: Error }
export const REPO_LIST_FAILURE = 'REPO_LIST_FAILURE'
export const RepoListFailure = (error: Error): RepoListFailureAction => ({ type: REPO_LIST_FAILURE, error })

export type IssueListRequestAction = { type: 'ISSUE_LIST_REQUEST' }
export const ISSUE_LIST_REQUEST = 'ISSUE_LIST_REQUEST'
export const IssueListRequest = (): IssueListRequestAction => ({ type: ISSUE_LIST_REQUEST })

// TODO: issues: Issue[]
export type IssueListSuccessAction = { type: 'ISSUE_LIST_SUCCESS', user: string, repo: string, issues: any[] }
export const ISSUE_LIST_SUCCESS = 'ISSUE_LIST_SUCCESS'
export const IssueListSuccess = (user: string, repo: string, issues: any[]): IssueListSuccessAction => ({ type: ISSUE_LIST_SUCCESS, user, repo, issues })

export type IssueListFailureAction = { type: 'ISSUE_LIST_FAILURE', error: Error }
export const ISSUE_LIST_FAILURE = 'ISSUE_LIST_FAILURE'
export const IssueListFailure = (error: Error): IssueListFailureAction => ({ type: ISSUE_LIST_FAILURE, error })

export type IntroRequestAction = { type: 'INTRO_REQUEST', user: string, repo: string, branch: string }
export const INTRO_REQUEST = 'INTRO_REQUEST'
export const IntroRequest = (user: string, repo: string, branch: string): IntroRequestAction => ({ type: INTRO_REQUEST, user, repo, branch })

export type IntroSuccessAction = { type: 'INTRO_SUCCESS', user: string, repo: string, branch: string, intro: string }
export const INTRO_SUCCESS = 'INTRO_SUCCESS'
export const IntroSuccess = (user: string, repo: string, branch: string, intro: string): IntroSuccessAction => ({ type: INTRO_SUCCESS, user, repo, branch, intro })

export type IntroFailureAction = { type: 'INTRO_FAILURE', user: string, repo: string, branch: string, error: Error }
export const INTRO_FAILURE = 'INTRO_FAILURE'
export const IntroFailure = (user: string, repo: string, branch: string, error: Error): IntroFailureAction => ({ type: INTRO_FAILURE, user, repo, branch, error })

// XXX: should move to metadata
export type G0vJsonRequestAction = { type: 'G0V_JSON_REQUEST', name: string, repo: string }
export const G0V_JSON_REQUEST = 'G0V_JSON_REQUEST'
export const g0vJsonRequest = (name: string, repo: string): G0vJsonRequestAction => ({ type: G0V_JSON_REQUEST, name, repo })

export type G0vJsonSuccessAction = { type: 'G0V_JSON_SUCCESS', name: string, repo: string, json: Project }
export const G0V_JSON_SUCCESS = 'G0V_JSON_SUCCESS'
export const g0vJsonSuccess = (name: string, repo: string, json: Project): G0vJsonSuccessAction => ({ type: G0V_JSON_SUCCESS, name, repo, json })

export type G0vJsonFailureAction = { type: 'G0V_JSON_FAILURE', name: string, repo: string, error: Error }
export const G0V_JSON_FAILURE = 'G0V_JSON_FAILURE'
export const g0vJsonFailure = (name: string, repo: string, error: Error): G0vJsonFailureAction => ({ type: G0V_JSON_FAILURE, name, repo, error })

export type GroupRequestAction = { type: 'GROUP_REQUEST' }
export const GROUP_REQUEST = 'GROUP_REQUEST'
export const GroupRequest = (): GroupRequestAction => ({ type: GROUP_REQUEST })

export type GroupSuccessAction = { type: 'GROUP_SUCCESS', groups: GroupMap }
export const GROUP_SUCCESS = 'GROUP_SUCCESS'
export const GroupSuccess = (groups: GroupMap): GroupSuccessAction => ({ type: GROUP_SUCCESS, groups })

export type GroupFailureAction = { type: 'GROUP_FAILURE', error: Error }
export const GROUP_FAILURE = 'GROUP_FAILURE'
export const GroupFailure = (error: Error): GroupFailureAction => ({ type: GROUP_FAILURE, error })

// functions
export const getLoginName = (state: State): string => {
  return (state && state.github && state.github.profile && state.github.profile.login) || ''
}

export const getEmail = (state: State): string => {
  return (state && state.github && state.github.profile && state.github.profile.email) || ''
}

export const isMember = (state: State): boolean => {
  return (state && state.github && state.github.isMember) || false
}

export const isRepoListLoading = (state: State): boolean => {
  return state && state.ui && state.ui.repos
}

export const getRepoList = (state: State): any[] => {
  return (state && state.github && state.github.repos) || []
}

export const dummyRepoList: any[] = [{
  id: 0,
  name: 'twbudget',
  full_name: 'g0v/twbudget',
  description: 'twbudget hacks for yahoo hackday tw 2012'
}, {
  id: 1,
  name: 'moedict-webkit',
  full_name: 'g0v/moedict-webkit',
  description: '萌典網站'
}, {
  id: 2,
  name: 'ly.g0v.tw',
  full_name: 'g0v/ly.g0v.tw',
  description: 'ly.g0v.tw - Congress Matters / 國會大代誌'
}]

export const fullName = (name: string, repo: string): string => `${name}/${repo}`

export const getUserMap = (state: State): any => {
  return (state && state.github && state.github.users) || {}
}

export const getIssueMap = (state: State): any => {
  return (state && state.github && state.github.issues) || {}
}

export const getIntroMap = (state: State): any => {
  return (state && state.intros) || {}
}

export const g0vJsonMap = (state: State, name:string, repo: string): { [key: string]: any } => {
  return (state && state.github && state.github.g0v) || {}
}

export const isGroupsLoading = (state: State): boolean => {
  return !!(state && state.ui && state.ui.github && state.ui.github.groups && state.ui.github.groups.isLoading)
}

export const getGroupMap = (state: State): GroupMap => {
  return (state && state.github && state.github.groups) || {}
}

export const getGroupStatus = (state: State): GroupMap => {
  return (state && state.github && state.github.groups && state.github.groups.status) || EmptyGroupStatus
}

// XXX: duplicated
export const findFirstValidMail = (emails: EMail[]): ?string => {
  for (let i = 0; i < emails.length; i++) {
    const m = emails[i]
    if (m.email && m.primary && m.verified && m.visibility === 'public') {
      return m.email
    }
  }
}

export const repoNameFromURL = (url: Url): { repo: string, name: string } => {
  const match = matchPath(url, { path: 'http(s?)://github.com/:repo/:name' })

  if (!match) return { repo: null, name: null }

  return { repo: match.params.repo, name: match.params.name }
}
