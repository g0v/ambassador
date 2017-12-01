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
  IssueListRequest,
  IssueListSuccess,
  IssueListFailure,
  IntroRequest,
  IntroSuccess,
  IntroFailure
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
    dispatch(IssueListSuccess(repo, issues))

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
