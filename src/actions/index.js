import type { RawAction } from '~/types/action'
import type { Statistics } from '~/types'

import {
  getUrl,
  StatisticsRequest,
  StatisticsSuccess,
  StatisticsFailure
} from '~/types'
import axios from 'axios'

import * as config from './config'
import * as auth from './auth'
import * as github from './github'
import * as logbot from './logbot'
import * as hashtag from './hashtag'
import * as resource from './resource'
import * as search from './search'

const apiUrl = getUrl(process.env.PROTOCOL, process.env.API_HOST, process.env.API_PORT)

const getStatistics: RawAction<[], Statistics> = store => async () => {
  const { dispatch } = store

  dispatch(StatisticsRequest())
  try {
    const { data: statistics } = await axios.get(`${apiUrl}/api/statistics`)
    dispatch(StatisticsSuccess(statistics))

    return statistics
  } catch (error) {
    dispatch(StatisticsFailure(error))
    throw error
  }
}

export { getStatistics, config, auth, github, logbot, hashtag, resource, search }
