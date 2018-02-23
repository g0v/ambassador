/* @flow */

import type { RawAction } from '~/types/action'
import type { GroupMap } from '~/types/metadata'

import axios from 'axios'
import GitHub from 'github-api'
import { getUrl } from '~/types'
import * as A from '~/types/auth'
import * as G from '~/types/github'
import {
  ProfileRequest,
  ProfileSuccess,
  ProfileFailure,
  UserRequest,
  UserSuccess,
  UserFailure,
  MemberRequest,
  MemberSuccess,
  MemberFailure,
  RepoListRequest,
  RepoListSuccess,
  RepoListFailure,
  RepoContributorListRequest,
  RepoContributorListSuccess,
  RepoContributorListFailure,
  IssueListRequest,
  IssueListSuccess,
  IssueListFailure,
  IntroRequest,
  IntroSuccess,
  IntroFailure,
  g0vJsonRequest,
  g0vJsonSuccess,
  g0vJsonFailure,
  GroupRequest,
  GroupSuccess,
  GroupFailure
} from '~/types/github'

// XXX: should use getUser action with no user name
export const getProfile: RawAction<[], any> = store => async () => {
  const { dispatch, getState } = store

  const token = A.getAccessToken(getState())
  // TODO: should use `es6-error`
  if (!token) {
    throw new Error('access token not found')
  }

  dispatch(ProfileRequest())
  try {
    const gh = new GitHub({ token })
    const user = gh.getUser()
    const { data: profile } = await user.getProfile()
    const { data: emails } = await user.getEmails()
    const email = G.findFirstValidMail(emails)

    // override the profile email, its usually null
    profile.email = email

    dispatch(ProfileSuccess(profile))

    return profile
  } catch (error) {
    dispatch(ProfileFailure(error))
    throw error
  }
}

export const getUser: RawAction<[string], any> = store => async (username) => {
  const { dispatch, getState } = store

  const token = A.getAccessToken(getState())
  if (!token) {
    throw new Error('access token not found')
  }

  dispatch(UserRequest(username))
  try {
    const gh = new GitHub({ token })
    const user = gh.getUser(username)
    const { data } = await user.getProfile()
    dispatch(UserSuccess(username, data))

    return data
  } catch (error) {
    dispatch(UserFailure(username, error))
    throw error
  }
}

export const isMember: RawAction<[string], boolean> = store => async (name) => {
  const { dispatch, getState } = store
  const state = getState()

  const token = A.getAccessToken(state)
  if (!token) {
    throw new Error('access token not found')
  }

  dispatch(MemberRequest())
  try {
    const gh = new GitHub({ token })
    const org = gh.getOrganization(name)
    await org.isMember(G.getLoginName(state))
    dispatch(MemberSuccess())

    return true
  } catch (error) {
    dispatch(MemberFailure(error))

    return false
  }
}

export const getRepos: RawAction<[string], any[]> = store => async (name) => {
  const { dispatch } = store

  dispatch(RepoListRequest())
  try {
    const gh = new GitHub()
    const org = gh.getOrganization(name)
    const { data: repos } = await org.getRepos()
    dispatch(RepoListSuccess(repos))

    return repos
  } catch (error) {
    dispatch(RepoListFailure(error))
    throw error
  }
}

export const getContributors: RawAction<[string, string], any[]> = store => async (name, repo) => {
  const { dispatch } = store

  dispatch(RepoContributorListRequest())
  try {
    const gh = new GitHub()
    const r = gh.getRepo(name, repo)
    const { data: contributors } = await r.getContributors()
    dispatch(RepoContributorListSuccess(contributors))

    return []
  } catch (error) {
    dispatch(RepoContributorListFailure(error))
    throw error
  }
}

export const getIssues: RawAction<[string, string], any[]> = store => async (user, repo) => {
  const { dispatch, getState } = store
  const state = getState()

  const token = A.getAccessToken(state)
  if (!token) {
    throw new Error('access token not found')
  }

  dispatch(IssueListRequest())
  try {
    const gh = new GitHub({ token })
    const is = gh.getIssues(user, repo)
    const { data: issues } = await is.listIssues({})
    dispatch(IssueListSuccess(user, repo, issues))

    return issues
  } catch (error) {
    dispatch(IssueListFailure(error))
    throw error
  }
}

const url = getUrl(process.env.PROTOCOL, process.env.HOST, process.env.PORT)

export const getIntro: RawAction<[string, string, string], string> = store => async (user, repo, branch = 'master') => {
  const { dispatch } = store
  const name = `${G.fullName(user, repo)}/${branch}`

  dispatch(IntroRequest(user, repo, branch))
  try {
    const { data: intro } = await axios.get(`${url}/data/${name}.md`)

    dispatch(IntroSuccess(user, repo, branch, intro))

    return intro
  } catch (error) {
    dispatch(IntroFailure(user, repo, branch, error))
    throw error
  }
}

const apiUrl = getUrl(process.env.PROTOCOL, process.env.API_HOST, process.env.API_PORT)

export const g0vJson: RawAction<[string, string], any> = store => async (name, repo) => {
  const { dispatch } = store

  dispatch(g0vJsonRequest(name, repo))
  try {
    const { data: result } = await axios.get(`${apiUrl}/api/metadata/v2/${name}/${repo}`)

    dispatch(g0vJsonSuccess(name, repo, result))

    return result
  } catch (error) {
    dispatch(g0vJsonFailure(name, repo, error))
    throw error
  }
}

export const getGroups: RawAction<[string], GroupMap> = store => async (version) => {
  const { dispatch } = store

  if (version !== 'v1' && version !== 'v2') {
    throw Error(`Invalid group version: ${version}`)
  }

  dispatch(GroupRequest())
  try {
    const { data: groups } = await axios.get(`${apiUrl}/api/group/${version}`)
    dispatch(GroupSuccess(groups))

    return groups
  } catch (error) {
    dispatch(GroupFailure(error))
    throw error
  }
}
