import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as G from '~/types/github'
import { Container, Divider } from 'semantic-ui-react'
import ReactMarkdown from 'react-markdown'
import { compose, find } from 'ramda'
import styles from './index.css'

class RepoPage extends PureComponent {
  static defaultProps = {
    className: ''
  }

  async componentDidMount() {
    const { actions, match } = this.props
    const { params: { repo } } = match

    try {
      await actions.github.getRepos('g0v')
      await actions.github.getContributors('g0v', repo)

      if (repo === 'moedict-webkit') {
        await actions.github.getIntro(repo, 'amis-react')
      } else if (repo === 'itaigi') {
        await actions.github.getIntro(repo)
      }
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    const { id, className, match, repos, intros } = this.props
    const { params: { repo } } = match

    const r = find(it => it.name === repo, repos)

    let branch = 'master'
    if (repo === 'moedict-webkit') {
      branch = 'amis-react'
    }

    const intro = intros[`${repo}/${branch}`] || ''

    return (
      <Container text id={id} className={cx(styles.main, className)}>
        <h1>{ repo }</h1>
        <h2>專案網址</h2>
        { r && <p><a href={r.html_url}>{ r.html_url }</a></p> }
        <h2>專案介紹</h2>
        { r && <p>{ r.description }</p> }
        <h2>想解決什麼問題</h2>
        <h2>用什麼方式解決</h2>
        <h2>人</h2>
        <h2>相關 GitHub repos</h2>
        <h2>GitHub issues</h2>
        <h2>社群動態</h2>
        <Divider />
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
