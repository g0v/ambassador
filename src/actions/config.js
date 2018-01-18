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

export const token: RawAction<[string], void> = store => async (token) => {
  const { dispatch } = store

  dispatch(ConfigTokenRequest(token))
  try {
    await axios.put(`${apiUrl}/api/config/token`, { token })
    dispatch(ConfigTokenSuccess(token))

    return
  } catch (error) {
    dispatch(ConfigTokenFailure(token, error))
    throw error
  }
}
