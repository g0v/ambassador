import React, { PureComponent } from 'react'
import cx from 'classnames'
import { Route } from 'react-router-dom'
import Header from '~/components/Header'
import LogbotPage from '~/components/LogbotPage'
import RepoListPage from '~/components/RepoListPage'
import IssueListPage from '~/components/IssueListPage'

import styles from './index.css'

class Root extends PureComponent {
  static defaultProps = {
    className: '',
  }

  render() {
    const { id, className } = this.props

    return (
      <div id={id} className={cx(styles.main, className)}>
        <Header />
        <div className={styles.container}>
          <Route exact path="/" component={LogbotPage} />
          <Route exact path="/repos" component={RepoListPage} />
          <Route exact path="/repos/:repo" component={IssueListPage} />
        </div>
      </div>
    );
  }
}

export default Root;

