/* @flow */

import type { DispatchAPI, MiddlewareAPI, Middleware } from 'redux'
import type { PlainAction, Action, RawAction } from '~/types/action'
import type { State } from '~/reducers'

// $FlowFixMe: unable to inference function types in a union type
export type Dispatch = DispatchAPI<PlainAction> & (<A, B>(RawAction<A, B>) => Action<A, B>)
// check: https://github.com/facebook/flow/issues/1948

export type StoreAPI = MiddlewareAPI<State, PlainAction, Dispatch>

export type App = Middleware<State, PlainAction, Dispatch>
const app: App = store => next => action =>
  typeof action === 'function'
    ? action(store)
    : next(action)

export default app
