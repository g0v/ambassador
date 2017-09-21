import React, { PureComponent } from 'react'
import cx from 'classnames'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from '~/components/Header'
import OAuthCallbackPage from '~/components/OAuthCallbackPage'
import MainPage from '~/components/MainPage'
import IssueListPage from '~/components/IssueListPage'
import CommentListPage from '~/components/CommentListPage'
import EditorPage from '~/components/EditorPage'

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
            <Header />
            <div className={styles.container}>
              <Route exact path="/" component={MainPage} />
              <Route exact path="/issues" component={IssueListPage} />
              <Route path="/issues/:id" component={CommentListPage} />
              <Route path="/editor" component={EditorPage} />
              <Route path="/callback" component={OAuthCallbackPage} />
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;

