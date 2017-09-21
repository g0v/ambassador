import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import * as func from '~/types/func'
import * as actions from '~/actions'
import * as A from '~/types/auth'
import * as G from '~/types/github'
import { Menu } from 'semantic-ui-react'
import { compose } from 'ramda'
import styles from './index.css'

class Header extends PureComponent {
  static defaultProps = {
    className: '',
  }

  render() {
    const { id, className, actions, location, unauthed, isLoggingIn, loginName } = this.props

    return (
      <Menu id={id} className={cx(styles.main, className)} inverted fixed="top">
        <Menu.Item
          as={Link}
          to="/"
          name="home"
          active={location.pathname === '/'}
        >
          YA0H
        </Menu.Item>
        <Menu.Item
          as={Link}
          to="/issues"
          name="issues"
          active={location.pathname === '/issues'}
        >
          Issues
        </Menu.Item>
        <Menu.Item
          as={Link}
          to="/editor"
          name="editor"
          active={location.pathname === '/editor'}
        >
          Editor
        </Menu.Item>
        <Menu.Menu position="right">{
          unauthed
            ? <Menu.Item
                name="sign-in"
                disabled={isLoggingIn}
                onClick={async (e) => {
                  await actions.auth.login()
                  await actions.github.getProfile()
                }}
              >
                Sign In
              </Menu.Item>
            : <Menu.Item
                name="sign-out"
                disabled={!loginName}
                onClick={() => actions.auth.logout()}
              >
                { loginName || 'Sign Out' }
              </Menu.Item>
        }</Menu.Menu>
      </Menu>
    )
  }
}

export default compose(
  withRouter,
  connect(
    state => {
      const unauthed = !A.getAccessToken(state)
      const isLoggingIn = A.isLoggingIn(state)
      const loginName = G.getLoginName(state)
      return { unauthed, isLoggingIn, loginName }
    },
    dispatch => ({ actions: func.map(dispatch, actions) })
  )
)(Header)
