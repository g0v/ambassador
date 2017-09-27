import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as A from '~/types/auth'
import * as G from '~/types/github'
import { Container, Item } from 'semantic-ui-react'
import IssueItem from '~/components/IssueItem'
import { compose, map } from 'ramda'
import styles from './index.css'

class IssueListPage extends PureComponent {
  static defaultProps = {
    className: '',
  }

  async fetchIssues() {
    const { match, actions, isLoggedIn } = this.props
    const { params: { repo } } = match
    const issues = this.props.issues[repo]

    if (isLoggedIn && issues === undefined) {
      await actions.github.getIssues('g0v', repo)
    }
  }

  async componentDidMount() {
    await this.fetchIssues()
  }

  async componentDidUpdate() {
    await this.fetchIssues()
  }

  render() {
    const { id, className, match } = this.props
    const { params: { repo } } = match
    const issues = this.props.issues[repo] || []

    return (
      <Container text id={id} className={cx(styles.main, className)}>
        <Item.Group divided>{
          map(data => <IssueItem key={data.id} data={data} />, issues)
        }</Item.Group>
      </Container>
    )
  }
}

export default compose(
  withRouter,
  connect(
    state => {
      const isLoggedIn = !!A.getAccessToken(state)
      const issues = G.getIssueMap(state)

      return { isLoggedIn, issues }
    },
    mapDispatchToProps(actions)
  )
)(IssueListPage)

