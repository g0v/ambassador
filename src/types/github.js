/* @flow */

import type { State } from '~/reducers'

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
export type IssueListSuccessAction = { type: 'ISSUE_LIST_SUCCESS', repo: string, issues: any[] }
export const ISSUE_LIST_SUCCESS = 'ISSUE_LIST_SUCCESS'
export const IssueListSuccess = (repo: string, issues: any[]): IssueListSuccessAction => ({ type: ISSUE_LIST_SUCCESS, repo, issues })

export type IssueListFailureAction = { type: 'ISSUE_LIST_FAILURE', error: Error }
export const ISSUE_LIST_FAILURE = 'ISSUE_LIST_FAILURE'
export const IssueListFailure = (error: Error): IssueListFailureAction => ({ type: ISSUE_LIST_FAILURE, error })

export type IntroRequestAction = { type: 'INTRO_REQUEST', name: string }
export const INTRO_REQUEST = 'INTRO_REQUEST'
export const IntroRequest = (name: string): IntroRequestAction => ({ type: INTRO_REQUEST, name })

export type IntroSuccessAction = { type: 'INTRO_SUCCESS', name: string, intro: string }
export const INTRO_SUCCESS = 'INTRO_SUCCESS'
export const IntroSuccess = (name: string, intro: string): IntroSuccessAction => ({ type: INTRO_SUCCESS, name, intro })

export type IntroFailureAction = { type: 'INTRO_FAILURE', error: Error }
export const INTRO_FAILURE = 'INTRO_FAILURE'
export const IntroFailure = (error: Error): IntroFailureAction => ({ type: INTRO_FAILURE, error })

// functions
export const getLoginName = (state: State): string => {
  return (state && state.github && state.github.profile && state.github.profile.login) || ''
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

export const getIssueMap = (state: State): any => {
  return (state && state.github && state.github.issues) || {}
}

export const getIntroMap = (state: State): any => {
  return (state && state.intros) || {}
}
