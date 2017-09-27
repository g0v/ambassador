/* @flow */

import type { State } from '~/reducers'

export const DATE_FORMAT = 'YYYY-MM-DD'

// data
export type DateChangeAction = { type: 'DATE_CHANGE', date: string }
export const DATE_CHANGE = 'DATE_CHANGE'
export const DateChange = (date: string): DateChangeAction => ({ type: DATE_CHANGE, date })

// functions
export const getDate = (state: State): string => {
  return (state && state.logbot && state.logbot.date) || ''
}
