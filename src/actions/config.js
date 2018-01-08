/* @flow */

import type { RawAction } from '~/types/action'

import { getUrl } from '~/types'
import {
  ConfigTokenRequest,
  ConfigTokenSuccess,
  ConfigTokenFailure
} from '~/types/config'
import axios from 'axios'

const apiUrl = getUrl(process.env.PROTOCOL, process.env.API_HOST, process.env.API_PORT)

export const token: RawAction<[string, string], void> = store => async (email, token) => {
  const { dispatch } = store

  dispatch(ConfigTokenRequest(email, token))
  try {
    await axios.put(`${apiUrl}/api/config/token`, { email, token })
    dispatch(ConfigTokenSuccess(email, token))

    return
  } catch (error) {
    dispatch(ConfigTokenFailure(email, token, error))
    throw error
  }
}
