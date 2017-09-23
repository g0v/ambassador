import GitHub from 'github-api'
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
  RepoListFailure
} from '~/types/github'

export const getProfile = store => async () => {
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

export const isMember = store => async (name) => {
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

export const getRepos = store => async (name) => {
  const { dispatch, getState } = store
  const state = getState()

  const token = A.getAccessToken(state)
  if (!token) {
    throw new Error('access token not found')
  }

  dispatch(RepoListRequest())
  try {
    const gh = new GitHub({ token })
    const org = gh.getOrganization(name)
    const { data: repos } = await org.getRepos()
    dispatch(RepoListSuccess(repos))

    return true
  } catch (error) {
    dispatch(RepoListFailure(error))

    return false
  }
}
