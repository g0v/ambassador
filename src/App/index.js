import React, { PureComponent } from 'react'
import cx from 'classnames'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import * as actions from '~/actions'
import * as T from '~/types/time'
import Root from '~/components/Root'
import OAuthCallbackPage from '~/components/OAuthCallbackPage'

import styles from './index.css'

const RETRY_TIMEOUT = 100000

class App extends PureComponent {
  static defaultProps = {
    className: '',
  }

  getStatistics = () => {
    const { store } = this.props

    // TODO: notify the user when fetching failed
    return actions.getStatistics(store)()
      .catch(err => {
        console.error(err)
        return Promise.resolve()
          .then(T.delay(RETRY_TIMEOUT))
          .then(this.getStatistics)
      })
  }

  getHashtags = () => {
    const { store } = this.props

    // TODO: notify the user when fetching failed
    return actions.hashtag.getHashtags(store)()
      .catch(err => {
        console.error(err)
        return Promise.resolve()
          .then(T.delay(RETRY_TIMEOUT))
          .then(this.getHashtags)
      })
  }

  getGroups = () => {
    const { store } = this.props

    return actions.github.getGroups(store)('v2')
      .catch(err => {
        console.error(err)
        return Promise.resolve()
          .then(T.delay(RETRY_TIMEOUT))
          .then(this.getGroups)
      })
  }

  async componentDidMount() {
    return [
      await this.getStatistics(),
      await this.getHashtags(),
      await this.getGroups()
    ]
  }

  render() {
    const { id, className, store } = this.props

    return (
      <Provider store={store}>
        <Router>
          <div id={id} className={cx(styles.main, className)}>
            <Route exact path="/callback" component={OAuthCallbackPage} />
            <Route path="/" component={Root} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;

