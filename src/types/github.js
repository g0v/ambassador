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

export const isMember = (state) => {
  return (state && state.github && state.github.isMember) || false
}

export const isRepoListLoading = (state) => {
  return state && state.ui && state.ui.repos
}

export const getRepoList = (state) => {
  return (state && state.github && state.github.repos) || []
}

export const dummyRepoList = [{
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
