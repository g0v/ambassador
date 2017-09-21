import GitHub from 'github-api'
import { getAccessToken } from '~/types/auth'
import {
  ProfileRequest,
  ProfileSuccess,
  ProfileFailure
} from '~/types/github'

export const getProfile = store => async () => {
  const { dispatch, getState } = store

  const token = getAccessToken(getState())
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
