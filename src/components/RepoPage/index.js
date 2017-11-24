import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as G from '~/types/github'
import { Container } from 'semantic-ui-react'
import ReactMarkdown from 'react-markdown'
import { compose } from 'ramda'
import styles from './index.css'

class RepoPage extends PureComponent {
  static defaultProps = {
    className: ''
  }

  async componentDidMount() {
    const { actions, match } = this.props
    const { params: { repo } } = match

    if (repo === 'moedict-webkit') {
      await actions.github.getIntro(repo, 'amis-react')
    } else if (repo === 'itaigi') {
      await actions.github.getIntro(repo)
    }
  }

  render() {
    const { id, className, match, isLoading, repos, intros } = this.props
    const { params: { repo } } = match

    let branch = 'master'
    if (repo === 'moedict-webkit') {
      branch = 'amis-react'
    }

    const intro = intros[`${repo}/${branch}`] || ''

    return (
      <Container text id={id} className={cx(styles.main, className)}>
        <h1>{ repo }</h1>
        <h2>專案狀態</h2>
        <p>...</p>
        <hr />
        <ReactMarkdown source={intro} />
      </Container>
    )
  }
}

export default compose(
  withRouter,
  connect(
    state => {
      const isLoading = G.isRepoListLoading(state)
      const repos = G.getRepoList(state)
      const intros = G.getIntroMap(state)

      return { isLoading, repos, intros }
    },
    mapDispatchToProps(actions)
  )
)(RepoPage)
