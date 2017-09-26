/* @flow */

import type { RawAction } from '~/types/action'

import {
  Nop
} from '~/types/action'
import * as auth from './auth'
import * as github from './github'
export { auth, github }

export const nop: RawAction<void, void> = store => async () => {
  const { dispatch } = store
  dispatch(Nop())
}

