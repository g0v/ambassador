import React, { PureComponent } from 'react'
import cx from 'classnames'
import { Route, Redirect } from 'react-router-dom'
import Header from '~/components/Header'
import LogbotPage from '~/components/LogbotPage'
import RepoListPage from '~/components/RepoListPage'
import IssueListPage from '~/components/IssueListPage'
import * as L from '~/types/logbot'
import moment from 'moment'

import styles from './index.css'

const redirectToLogbot = (props) => {
  const params = (props && props.match && props.match.params) || {}
  let { channel, date } = params

  channel = channel || 'g0v.tw'
  date = date || moment().format(L.DATE_FORMAT)

  return <Redirect to={`/logbot/${channel}/${date}`} />
}

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
          <Route exact path="/" render={redirectToLogbot} />
          <Route exact path="/logbot" render={redirectToLogbot} />
          <Route exact path="/logbot/:channel" render={redirectToLogbot} />
          <Route exact path="/logbot/:channel/:date" component={LogbotPage} />
          <Route exact path="/repos" component={RepoListPage} />
          <Route exact path="/repos/:repo" component={IssueListPage} />
        </div>
      </div>
    );
  }
}

export default Root;

