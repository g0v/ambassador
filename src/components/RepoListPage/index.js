import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as A from '~/types/auth'
import * as G from '~/types/github'
import { Container, Item, Dimmer, Segment, Header } from 'semantic-ui-react'
import RepoItem from '../RepoItem'
import { compose, map } from 'ramda'
import styles from './index.css'

class RepoListPage extends PureComponent {
  static defaultProps = {
    className: ''
  }

  async componentDidMount() {
    const { actions } = this.props

    await actions.github.getRepos('g0v')
  }

  async componentDidUpdate() {
    const { actions, isLoading, repos } = this.props

    if (isLoading || repos.length !== 0) return

    await actions.github.getRepos('g0v')
  }

  render() {
    const { id, className, isLoading } = this.props
    const dimmed = isLoading
    let repos = this.props.repos
    if (dimmed && repos.length === 0) {
      repos = G.dummyRepoList
    }

    return (
      <Dimmer.Dimmable className={styles.dimmable} as={Segment} blurring dimmed={dimmed}>
        <Dimmer active={dimmed}>
          <Header as='h2' inverted>
            Loading...
          </Header>
        </Dimmer>

        <Container text id={id} className={cx(styles.main, className)}>
          <Item.Group divided>{
            map(data => <RepoItem key={data.id} data={data} />, repos)
          }</Item.Group>
        </Container>
      </Dimmer.Dimmable>
    )
  }
}

export default compose(
  withRouter,
  connect(
    state => {
      const isLoading = G.isRepoListLoading(state)
      const repos = G.getRepoList(state)

      return { isLoading, repos }
    },
    mapDispatchToProps(actions)
  )
)(RepoListPage)
