/* @flow */

import type { RawAction } from '~/types/action'

import axios from 'axios'
import GitHub from 'github-api'
import { getUrl } from '~/types'
import * as A from '~/types/auth'
import * as G from '~/types/github'
import {
  ProfileRequest,
  ProfileSuccess,
  ProfileFailure,
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
  g0vPatchRequest,
  g0vPatchSuccess,
  g0vPatchFailure
} from '~/types/github'

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
    dispatch(ProfileSuccess(profile))

    return profile
  } catch (error) {
    dispatch(ProfileFailure(error))
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

export const getIntro: RawAction<[string, string], string> = store => async (repo, branch = 'master') => {
  const { dispatch } = store
  const name = `${repo}/${branch}`

  dispatch(IntroRequest(name))
  try {
    const { data: intro } = await axios.get(`${url}/data/${name}.md`)

    dispatch(IntroSuccess(name, intro))

    return intro
  } catch (error) {
    dispatch(IntroFailure(error))
    throw error
  }
}

const apiUrl = getUrl(process.env.PROTOCOL, process.env.API_HOST, process.env.API_PORT)

export const g0vJson: RawAction<[string, string], any> = store => async (name, repo) => {
  const { dispatch } = store

  dispatch(g0vJsonRequest(name, repo))
  try {
    const { data: json } = await axios.get(`${apiUrl}/api/github/${name}/${repo}/g0v.json`)
    const patch = await dispatch(g0vPatch)(name, repo).catch(() => ({}))
    const result = { ...json, ...patch }
    console.log(json, patch)

    dispatch(g0vJsonSuccess(name, repo, result))

    return result
  } catch (error) {
    dispatch(g0vJsonFailure(name, repo, error))
    throw error
  }
}

export const g0vPatch: RawAction<[string, string, string], any> = store => async (name, repo, branch = 'master') => {
  const { dispatch } = store

  dispatch(g0vPatchRequest(name, repo, branch))
  try {
    const { data: json } = await axios.get(`${url}/data/${repo}/${branch}.patch.json`)

    dispatch(g0vPatchSuccess(name, repo, branch, json))

    return json
  } catch (error) {
    dispatch(g0vPatchFailure(name, repo, branch, error))
    console.error(error)
    throw error
  }
}
