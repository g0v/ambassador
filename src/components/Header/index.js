import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { withRouter, Link, matchPath } from 'react-router-dom'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as A from '~/types/auth'
import * as G from '~/types/github'
import * as L from '~/types/logbot'
import * as S from '~/types/search'
import { Menu, Icon, Search, Dropdown } from 'semantic-ui-react'
import CalendarModal from '~/components/CalendarModal'
import { compose } from 'ramda'
import debounce from 'lodash.debounce'
import moment from 'moment'
import styles from './index.css'

class Header extends PureComponent {
  static defaultProps = {
    className: '',
  }

  render() {
    const {
      id, className, history, actions,
      location, unauthed, isLoggingIn, loginName,
      search
    } = this.props
    const match = matchPath(
      location.pathname,
      { path: '/logbot/:channel/:date', exact: true }
    )
    let { channel, date } = (match && match.params) || {}
    channel = channel || 'g0v.tw'
    date = date || moment().format(L.DATE_FORMAT)

    return (
      <Menu id={id} className={cx(styles.main, className)} inverted fixed="top">
        <Menu.Item
          as={Link}
          to="/"
          name="index"
          active={location.pathname === '/'}
        >
          機器大使
        </Menu.Item>
        {
          !unauthed &&
          <Menu.Item
            as={Link}
            to="/groups"
            name="groups"
            active={location.pathname.startsWith('/groups')}
          >
            專案群組
          </Menu.Item>
        }
        {
          !unauthed &&
          <Menu.Item
            as={Link}
            to="/repos"
            name="issues"
            active={location.pathname === '/repos'}
          >
            專案列表
          </Menu.Item>
        }
        {
          !unauthed &&
          <Dropdown item text="標記工具">
            <Dropdown.Menu>
              <CalendarModal
                trigger={
                  <Dropdown.Item
                    as={Link}
                    to={`/logbot/${channel}/${date}`}
                    name="logbot"
                    active={location.pathname.startsWith('/logbot')}
                  >
                    <Icon name="calendar" />
                    Logbot
                  </Dropdown.Item>
                }
                date={date}
                onSelect={date => history.push((moment(date).format(L.DATE_FORMAT)))}
              />
              <Dropdown.Item
                as={Link}
                to="/resources"
                name="resources"
                active={location.pathname === '/resources'}
              >
                外部資源
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        }
        <Menu.Menu position="right">
          <Menu.Item>
            <Search
              loading={search.isLoading}
              size="mini"
              value={search.value}
              showNoResults={false}
              onSearchChange={(e) => {
                actions.search.change(e.target.value)
                actions.search.g0vSearch(e.target.value)
                history.push('/search')
              }}
            />
          </Menu.Item>
        {
          unauthed
            ? <Menu.Item
                name="sign-in"
                disabled={isLoggingIn}
                onClick={async (e) => {
                  await actions.auth.login()
                  await actions.github.getProfile()
                }}
              >
                登入
              </Menu.Item>
            : <Dropdown item text={ loginName || '...' }>
                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Link}
                    to="/config"
                    name="config"
                  >
                    設定
                  </Dropdown.Item>
                  <Dropdown.Item
                    name="sign-out"
                    disabled={!loginName}
                    onClick={() => actions.auth.logout()}
                  >
                    登出
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
        }
        </Menu.Menu>
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
      const search = S.getSearch(state)

      return { unauthed, isLoggingIn, loginName, search }
    },
    dispatch => {
      const r = mapDispatchToProps(actions)(dispatch)
      // TODO: make a debounce function that returns a promise
      r.actions.search.g0vSearch = debounce(r.actions.search.g0vSearch, 3000)

      return r
    }
  )
)(Header)
