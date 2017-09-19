import React, { PureComponent } from 'react'
import cx from 'classnames'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'
import styles from './index.css'

class OAuthCallbackPage extends PureComponent {
  static defaultPage = {
    className: '',
  }

  componentDidMount() {
    const { location } = this.props
    const auth = queryString.parse(location.search)
    console.log('postMessage', auth)
    global.postMessage(auth, '*')
  }

  render() {
    const { id, className } = this.props

    return (
      <div id={id} className={cx(styles.main, className)}>
        oauth callback page
      </div>
    )
  }
}

export default withRouter(OAuthCallbackPage)
