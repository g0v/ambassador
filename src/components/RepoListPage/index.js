import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actions from '~/actions'
import { getUrl } from '~/types'
import { mapDispatchToProps } from '~/types/action'
import * as G from '~/types/github'
import { Container, Dimmer, Segment, Header, Card, Button } from 'semantic-ui-react'
import { compose, map } from 'ramda'
import RepoCard from '~/components/RepoCard'
import styles from './index.css'

const apiUrl = getUrl(process.env.PROTOCOL, process.env.API_HOST, process.env.API_PORT)

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
      repos = []
    }

    return (
      <Dimmer.Dimmable className={styles.dimmable} as={Segment} blurring dimmed={dimmed}>
        <Dimmer active={dimmed}>
          <Header as='h2' inverted>
            Loading...
          </Header>
        </Dimmer>

        <Container id={id} className={cx(styles.main, className)}>
          <Button
            floated="right"
            as="a"
            href={`${apiUrl}/api/repo`}
            target="_blank"
          >
            JSON
          </Button>
          <Card.Group itemsPerRow={4}>{
            map(
              fullname => {
                const [repo, name] = fullname.split('/')

                return (
                  <RepoCard key={fullname} repo={repo} name={name} />
                )
              },
              repos
            )
          }</Card.Group>
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
