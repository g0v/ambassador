/* @flow */

import type { RawAction } from '~/types/action'

import {
  DateChange
} from '~/types/logbot'

export const setDate: RawAction<[string], string> = store => async (date) => {
  const { dispatch } = store

  dispatch(DateChange(date))

  return date
}
