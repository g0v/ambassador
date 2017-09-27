import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as A from '~/types/auth'
import * as G from '~/types/github'
import * as L from '~/types/logbot'
import { Menu, Icon } from 'semantic-ui-react'
import CalendarModal from '~/components/CalendarModal'
import { compose } from 'ramda'
import moment from 'moment'
import styles from './index.css'

class Header extends PureComponent {
  static defaultProps = {
    className: '',
  }

  render() {
    const { id, className, actions, location, unauthed, isLoggingIn, loginName, date } = this.props

    return (
      <Menu id={id} className={cx(styles.main, className)} inverted fixed="top">
        <Menu.Item>YA0H</Menu.Item>
        <CalendarModal
          trigger={
            <Menu.Item
              as={Link}
              to="/"
              name="logbot"
              active={location.pathname === '/'}
            >
              <Icon name="calendar" />
              Logbot
            </Menu.Item>
          }
          date={date}
          onSelect={date => actions.logbot.setDate(moment(date).format(L.DATE_FORMAT))}
        />
        <Menu.Item
          as={Link}
          to="/repos"
          name="issues"
          active={location.pathname === '/repos'}
        >
          Repositories
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
      const date = L.getDate(state)

      return { unauthed, isLoggingIn, loginName, date }
    },
    mapDispatchToProps(actions)
  )
)(Header)
