import React, { PureComponent } from 'react'
import cx from 'classnames'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Root from '~/components/Root'
import OAuthCallbackPage from '~/components/OAuthCallbackPage'

import styles from './App.css'

class App extends PureComponent {
  static defaultProps = {
    className: '',
  }

  render() {
    const { id, className, store } = this.props

    return (
      <Provider store={store}>
        <Router>
          <div id={id} className={cx(styles.main, className)}>
            <Route exact path="/callback" component={OAuthCallbackPage} />
            <Route exact path="/" component={Root} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;

