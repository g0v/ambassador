export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LoginRequest = () => ({ type: LOGIN_REQUEST })

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LoginSuccess = (auth) => ({ type: LOGIN_SUCCESS, auth })

export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LoginFailure = (error) => ({ type: LOGIN_FAILURE, error })

export const LOGOUT = 'LOGOUT'
export const Logout = () => ({ type: LOGOUT })
