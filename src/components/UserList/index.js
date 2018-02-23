import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as G from '~/types/github'
import { List, Image } from 'semantic-ui-react'
import { map } from 'ramda'
import styles from './index.css'
import thumbnail from '~/images/thumbnail.png'

class UserList extends PureComponent {
  static defaultProps = {
    className: '',
    userMap: {},
    users: []
  }

  componentDidUpdate(prevProps) {
    const { actions, userMap, users } = this.props

    if (prevProps.users === users) return

    for (const user of users) {
      if (!userMap[user]) {
        actions.github.getUser(user)
          .catch(err => console.error(err))
      }
    }
  }

  render() {
    const { id, className, userMap, users } = this.props

    return (
      <List id={id} className={cx(styles.main, className)}>{
        map(
          user =>
            <List.Item key={user}>
              <Image avatar src={(userMap[user] && userMap[user].avatar_url) || thumbnail} />
              <List.Content>
                <List.Header>{ user }</List.Header>
                {
                  userMap[user] && userMap[user].html_url &&
                    <a href={userMap[user.html_url] || '#'} target="_blank">
                      { userMap[user].html_url }
                    </a>
                }
              </List.Content>
            </List.Item>,
          users
        )
      }</List>
    )
  }
}

export default connect(
  state => {
    const userMap = G.getUserMap(state)

    return { userMap }
  },
  mapDispatchToProps(actions)
)(UserList)
