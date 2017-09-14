import React from 'react'
import ReactDOM from 'react-dom'
import store from '~/store'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

const s = store()
const rootEl = document.getElementById('root')

ReactDOM.render(<App store={s} />, rootEl)
registerServiceWorker()

