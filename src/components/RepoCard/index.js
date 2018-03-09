import React, { Component } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as G from '~/types/github'
import { Card } from 'semantic-ui-react'
import VisibilitySensor from 'react-visibility-sensor'
import AnyImage from '~/components/AnyImage'
import styles from './index.css'

class RepoCard extends Component {
  static defaultProps = {
    className: '',
    repo: 'g0v',
    name: ''
  }

  handleVisibility = (isVisible) => {
    const { actions, g0vJsonMap, repo, name } = this.props
    const fullname = G.fullName(repo, name)
    const data = g0vJsonMap[fullname]

    if (!data && isVisible) {
      actions.github.g0vJson(repo, name)
        .catch(err => console.warn(err))
    }
  }

  render() {
    const { id, className, g0vJsonMap, repo, name } = this.props
    const fullname = G.fullName(repo, name)
    const data = g0vJsonMap[fullname] || {}

    return (
      <Card id={id} className={cx(styles.main, className)}>
        <VisibilitySensor onChange={this.handleVisibility} />
        <AnyImage images={data.thumbnail} />
        <Card.Content>
          {
            repo === 'g0v'
              ? <Card.Header as={Link} to={`/repos/${name}`}>
                  { data.name_zh || data.name || fullname }
                </Card.Header>
              : <Card.Header>{ data.name_zh || data.name || fullname }</Card.Header>
          }
          <Card.Description>{ data.description_zh || data.description || '沒有人寫介紹！' }</Card.Description>
        </Card.Content>
      </Card>
    )
  }
}

export default connect(
  state => {
    const g0vJsonMap = G.g0vJsonMap(state)

    return { g0vJsonMap }
  },
  mapDispatchToProps(actions)
)(RepoCard)
