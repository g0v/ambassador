/* @flow */

import type { PlainAction, Action, RawAction } from '~/types/action'
import type { Store } from './index'

export type App<A, B> = Store => (PlainAction => PlainAction) => (PlainAction => PlainAction | RawAction<A, B> => Action<A, B>)

const app: App<*, *> = store => next => action =>
  typeof action === 'function'
    ? action(store)
    : next(action)
export default app
