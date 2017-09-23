import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as func from '~/types/func'
import * as actions from '~/actions'
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

  render() {
    const { id, className, isLoggedIn, isMember, isLoading, repos } = this.props
    const dimmed = (!isLoggedIn || !isMember) && !isLoading

    // TODO: you don't have to be a member to browse g0v repos
    return (
      <Dimmer.Dimmable className={styles.dimmable} as={Segment} blurring dimmed={dimmed}>
        <Dimmer active={dimmed}>
          <Header as='h2' inverted>{
            !isLoggedIn
              ? 'Sign in to see g0v repos'
              : !isMember
                  ? 'Be a member of g0v to see repos'
                  : ''
          }</Header>
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
      const isLoggedIn = !!A.getAccessToken(state)
      const isMember = G.isMember(state)
      const isLoading = G.isRepoListLoading(state)

      let repos = G.getRepoList(state)
      if (!isLoading && repos.length === 0) {
        repos = G.dummyRepoList
      }

      return { isLoggedIn, isMember, isLoading, repos }
    },
    dispatch => ({ actions: func.map(dispatch, actions) })
  )
)(RepoListPage)
