import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import * as func from '~/types/func'
import * as actions from '~/actions'
import { withRouter, Link } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import { compose } from 'ramda'
import styles from './index.css'

class Header extends PureComponent {
  static defaultProps = {
    className: '',
  }

  render() {
    const { id, className, actions, location, auth } = this.props

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
          auth === undefined
            ? <Menu.Item
                name="sign-in"
                onClick={() => actions.auth.login()}
              >
                Sign In
              </Menu.Item>
            : <Menu.Item
                name="sign-out"
              >
                Sign Out
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
      const { auth } = state
      return { auth }
    },
    dispatch => ({ actions: func.map(dispatch, actions) })
  )
)(Header)
