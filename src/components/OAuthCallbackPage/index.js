import React, { PureComponent } from 'react'
import cx from 'classnames'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'
import logo from '~/images/g0v.jump.l.gif'
import styles from './index.css'

class OAuthCallbackPage extends PureComponent {
  static defaultPage = {
    className: '',
  }

  componentDidMount() {
    const { location } = this.props
    const auth = queryString.parse(location.search)
    const origin = '*'
    if (global.opener) {
      global.opener.postMessage(auth, origin)
    } else {
      global.parent.postMessage(auth, origin)
    }
  }

  render() {
    const { id, className } = this.props

    return (
      <div id={id} className={cx(styles.main, className)}>
        <img src={logo} alt="loading..." />
      </div>
    )
  }
}

export default withRouter(OAuthCallbackPage)
