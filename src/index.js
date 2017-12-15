import React from 'react'
import ReactDOM from 'react-dom'
import store from '~/store'
import { initialState as state } from '~/reducers'
import * as actions from '~/actions'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import './index.css'
import S from 'store'

const auth = S.get('auth')
// state should be merged by the reducer
const s = store({ ...state, auth })
if (auth) {
  s.dispatch(actions.github.getProfile)()
}

const rootEl = document.getElementById('root')

ReactDOM.render(<App store={s} />, rootEl)
registerServiceWorker()

