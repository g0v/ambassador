/* @flow */

import type { Dispatch as ReduxDispatch, MiddlewareAPI, Middleware } from 'redux'
import type { PlainAction, Action, RawAction } from '~/types/action'
import type { State } from '~/reducers'

export type Dispatch<A, B>
  = ReduxDispatch<PlainAction>
  | (RawAction<A, B> => Action<A, B>)

export type MiddlewareStore<A, B> = MiddlewareAPI<State, PlainAction, Dispatch<A, B>>

//export type App<A, B> = Middleware<State, any, Dispatch<A, B>>
export type App<A, B> = MiddlewareStore<A, B> => Dispatch<A, B> => Dispatch<A, B>

const app: App<*, *> = store => next => action =>
  typeof action === 'function'
    ? action(store)
    : next(action)
export default app
