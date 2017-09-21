export const PROFILE_REQUEST = 'PROFILE_REQUEST'
export const ProfileRequest = () => ({ type: PROFILE_REQUEST })

export const PROFILE_SUCCESS = 'PROFILE_SUCCESS'
export const ProfileSuccess = (profile) => ({ type: PROFILE_SUCCESS, profile })

export const PROFILE_FAILURE = 'PROFILE_FAILURE'
export const ProfileFailure = (error) => ({ type: PROFILE_FAILURE })

export const getLoginName = (state) => {
  return (state && state.github && state.github.profile && state.github.profile.login) || ''
}
