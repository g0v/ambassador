/* @flow */

import type { DispatchAPI, MiddlewareAPI, Middleware } from 'redux'
import type { PlainAction, Action, RawAction } from '~/types/action'
import type { State } from '~/reducers'

// $FlowFixMe: unable to inference function types in a union type
type InjectStore<A, B> = RawAction<A, B> => Action<A, B>
export type Dispatch
  = DispatchAPI<PlainAction>
  | InjectStore<*, *>
// check: https://github.com/facebook/flow/issues/1948

export type StoreAPI = MiddlewareAPI<State, PlainAction, Dispatch>

// $FlowFixMe: PlainAction is not a function type and RawAction is a function type
export type App = Middleware<State, PlainAction, Dispatch>
const app: App = store => next => action =>
  typeof action === 'function'
    ? action(store)
    : next(action)
export default app
