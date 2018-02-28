import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as actions from '~/actions'
import * as G from '~/types/github'
import { mapDispatchToProps } from '~/types/action'
import { Container, List } from 'semantic-ui-react'
import { compose, map, keys } from 'ramda'
import styles from './index.css'

class GroupListPage extends PureComponent {
  static defaultProps = {
    className: ''
  }

  render() {
    const { id, className, groups } = this.props

    return (
      <Container text id={id} className={cx(styles.main, className)}>
        <List>{
          compose(
            map(url =>
              <List.Item key={url} as={Link} to={`/groups/${encodeURIComponent(url)}`}>
                { `${groups[url].name || url} 相關專案` }
              </List.Item>
            ),
            keys
          )(groups)
        }</List>
      </Container>
    )
  }
}

export default connect(
  state => {
    const groups = G.getGroupMap(state)

    return { groups }
  },
  mapDispatchToProps(actions)
)(GroupListPage)
