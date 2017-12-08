import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as G from '~/types/github'
import { Container, List, Divider } from 'semantic-ui-react'
import ReactMarkdown from 'react-markdown'
import { compose, find, map } from 'ramda'
import styles from './index.css'

class RepoPage extends PureComponent {
  static defaultProps = {
    className: ''
  }

  async componentDidMount() {
    const { actions, match, repos } = this.props
    const { params: { repo } } = match

    try {
      if (repo === 'moedict-webkit') {
        await actions.github.getIntro(repo, 'amis-react')
      } else if (repo === 'itaigi') {
        await actions.github.getIntro(repo)
      }

      await actions.github.g0vJson('g0v', repo)
      // XXX: should keep the promise
      if (repos.length !== 0) {
        await actions.github.getRepos('g0v')
      }
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    const { id, className, match, repos, intros, g0vJsonMap } = this.props
    const { params: { repo } } = match
    const fullname = G.fullName('g0v', repo)
    const g0vJson = g0vJsonMap[fullname] || {}

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
        <List horizontal>{
          map(
            user =>
              <List.Item key={user}>
                <List.Content>
                  <List.Header>{ user }</List.Header>
                </List.Content>
              </List.Item>,
            g0vJson.contributors || []
          )
        }</List>
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
      const g0vJsonMap = G.g0vJsonMap(state)

      return { isLoading, repos, intros, g0vJsonMap }
    },
    mapDispatchToProps(actions)
  )
)(RepoPage)
