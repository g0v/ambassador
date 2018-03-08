import React, { Component } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as G from '~/types/github'
import { Card } from 'semantic-ui-react'
import AnyImage from '~/components/AnyImage'
import styles from './index.css'

class RepoCard extends Component {
  static defaultProps = {
    className: '',
    repo: 'g0v',
    name: ''
  }

  componentDidMount() {
    const { actions, repo, name } = this.props

    actions.github.g0vJson(repo, name)
      .catch(err => console.warn(err))
  }

  render() {
    const { id, className, g0vJsonMap, repo, name } = this.props
    const fullname = G.fullName(repo, name)
    const data = g0vJsonMap[fullname] || {}

    return (
      <Card id={id} className={cx(styles.main, className)}>
        <AnyImage images={data.thumbnail} />
        <Card.Content>
          <Card.Header>{ data.name_zh || data.name || fullname }</Card.Header>
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
