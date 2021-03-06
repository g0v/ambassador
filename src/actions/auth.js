/* @flow */

import type { RawAction } from '~/types/action'

import { getUrl } from '~/types'
import {
  LoginRequest,
  LoginSuccess,
  LoginFailure,
  Logout
} from '~/types/auth'

const apiOrigin = getUrl(process.env.PROTOCOL, process.env.API_HOST, process.env.API_PORT)
let _loginPromise
let _abortLogin = () => {}
export const login: RawAction<[], any> = store => async () => {
  const { dispatch } = store

  dispatch(LoginRequest())

  if (!_loginPromise) {
    // open OAuth page in a new window
    const w = 480
    const h = 640
    const l = global.screen.width / 2 - w / 2
    const t = global.screen.height / 2 - h / 2
    let win = global.open(
      apiOrigin + '/api/auth',
      'oauth',
      `width=${w},height=${h},top=${t},left=${l},toolbar=no,location=no,directories=nostatus=no,menubar=no,scrollbars=yes,resizable=no,copyhistory=no`
    )

    // wait for the access_token
    _loginPromise = new Promise((resolve, reject) => {
      let cleanup
      _abortLogin = () => {
        reject(new Error('login process interrupted by user'))
        cleanup()
      }
      const handleLogin = (e) => {
        if (e.data.access_token) {
          if (e.origin !== apiOrigin) {
            reject(new Error('origin mismatched'))
          } else {
            resolve(e.data)
          }
          cleanup()
        }
      }
      cleanup = () => {
        win && win.close()
        win = undefined
        _abortLogin = () => {}
        _loginPromise = undefined
        global.removeEventListener('message', handleLogin)
      }
      global.addEventListener('message', handleLogin)
    })
  }

  try {
    const auth = await _loginPromise
    dispatch(LoginSuccess(auth))

    return auth
  } catch (error) {
    dispatch(LoginFailure(error))
    throw error
  }
}

export const abort: RawAction<[], void> = store => async () => {
  _abortLogin()
}

export const logout: RawAction<[], void> = store => async () => {
  const { dispatch } = store
  dispatch(Logout())
}
