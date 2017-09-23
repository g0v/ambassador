export const PROFILE_REQUEST = 'PROFILE_REQUEST'
export const ProfileRequest = () => ({ type: PROFILE_REQUEST })

export const PROFILE_SUCCESS = 'PROFILE_SUCCESS'
export const ProfileSuccess = (profile) => ({ type: PROFILE_SUCCESS, profile })

export const PROFILE_FAILURE = 'PROFILE_FAILURE'
export const ProfileFailure = (error) => ({ type: PROFILE_FAILURE })

export const MEMBER_REQUEST = 'MEMBER_REQUEST'
export const MemberRequest = () => ({ type: MEMBER_REQUEST })

export const MEMBER_SUCCESS = 'MEMBER_SUCCESS'
export const MemberSuccess = () => ({ type: MEMBER_SUCCESS })

export const MEMBER_FAILURE = 'ORGANIZATION_FAILURE'
export const MemberFailure = (error) => ({ type: MEMBER_FAILURE, error })

export const REPO_LIST_REQUEST = 'REPO_LIST_REQUEST'
export const RepoListRequest = () => ({ type: REPO_LIST_REQUEST })

export const REPO_LIST_SUCCESS = 'REPO_LIST_SUCCESS'
export const RepoListSuccess = (repos) => ({ type: REPO_LIST_SUCCESS, repos })

export const REPO_LIST_FAILURE = 'REPO_LIST_FAILURE'
export const RepoListFailure = (error) => ({ type: REPO_LIST_FAILURE, error })

export const getLoginName = (state) => {
  return (state && state.github && state.github.profile && state.github.profile.login) || ''
}
