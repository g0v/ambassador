import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as G from '~/types/github'
import { Container, List, Grid, Segment, Rail } from 'semantic-ui-react'
import ReactMarkdown from 'react-markdown'
import ProductListItem from '../ProductListItem'
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
      await actions.github.getIssues('g0v', repo)
      // XXX: should keep the promise
      if (false && repos.length !== 0) {
        await actions.github.getRepos('g0v')
      }
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    const { id, className, match, repos, intros, g0vJsonMap, issueMap } = this.props
    const { params: { repo } } = match
    const fullname = G.fullName('g0v', repo)
    const g0vJson = g0vJsonMap[fullname] || {}
    const issues = issueMap[fullname] || []

    const r = find(it => it.name === repo, repos)

    let branch = 'master'
    if (repo === 'moedict-webkit') {
      branch = 'amis-react'
    }

    const intro = intros[`${repo}/${branch}`] || ''

    return (
      <Container text id={id} className={cx(styles.main, className)}>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Segment>
                <h2>專案成果</h2>
                <List className="url-list">{
                  g0vJson && g0vJson.products &&
                    map(
                      p => typeof p === 'string'
                        ? <List.Item key={p} content={p} />
                        : <ProductListItem data={p} />,
                      g0vJson.products
                    )
                }</List>
              </Segment>
              <Segment>
                <h2>重要文件和資訊</h2>
                <ul>
                {
                  r && r.homepage &&
                    <li className="github-homepage">首頁：<a href={r.homepage}>{ r.homepage }</a></li>
                }
                {
                  (r && r.html_url)
                    ? <li className="github-html_url">源碼：<a href={r.html_url}>{ r.html_url }</a></li>
                    : (g0vJson && g0vJson.repository && g0vJson.repository.url) &&
                        <li className="g0v-repository-url">源碼：<a href={g0vJson.repository.url}>{ g0vJson.repository.url }</a></li>
                }
                </ul>
              </Segment>
              <Segment>
                <h2>參與者</h2>
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
              </Segment>
              <Segment>
                <ReactMarkdown source={intro} />
              </Segment>

              <Rail close="very" position="left">
                <h1>{ repo }</h1>
                {
                  g0vJson && g0vJson.thumbnail && g0vJson.thumbnail[0] &&
                    <div className={styles.thumbnail} style={{ backgroundImage: `url(${g0vJson.thumbnail[0]})` }} />
                }
                {
                  r &&
                    <p className="github-description">{ r.description }</p>
                }
                {
                  g0vJson && g0vJson.description &&
                    <p className="g0v-description">{ g0vJson.description }</p>
                }
                {
                  g0vJson && g0vJson.description_zh &&
                    <p className="g0v-description_zh">{ g0vJson.description_zh }</p>
                }
              </Rail>

              <Rail close="very" position="right">
                <Segment>
                  <h2>相關 repos</h2>
                  <List>{
                    g0vJson && g0vJson.projects &&
                      map(
                        p => typeof p === 'string'
                          ? <List.Item key={p} content={p} />
                          : <ProductListItem key={p.name} data={p} />,
                        g0vJson.projects
                      )
                  }</List>
                </Segment>
                <Segment>
                  <h2>相關 issues</h2>
                  <List>{
                    map(
                      i =>
                        <List.Item key={i.id}>
                          <List.Icon name="github" />
                          <List.Content>
                            <a href={i.url} target="_blank">{ i.title }</a>
                          </List.Content>
                        </List.Item>,
                      issues
                    )
                  }</List>
                </Segment>
                <Segment>
                  <h2>社群動態</h2>
                </Segment>
              </Rail>
            </Grid.Column>
          </Grid.Row>
        </Grid>
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
      const issueMap = G.getIssueMap(state)

      return { isLoading, repos, intros, g0vJsonMap, issueMap }
    },
    mapDispatchToProps(actions)
  )
)(RepoPage)
