import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as G from '~/types/github'
import { Container, List, Grid, Segment, Rail, Image } from 'semantic-ui-react'
import ReactMarkdown from 'react-markdown'
import ProductListItem from '../ProductListItem'
import { compose, find, map } from 'ramda'
import styles from './index.css'
import thumbnail from '~/images/thumbnail.png'

class RepoPage extends PureComponent {
  static defaultProps = {
    className: ''
  }

  async componentDidMount() {
    const { actions, match, repos } = this.props
    const { params: { repo } } = match

    try {
      if (repo === 'amis-moedict' || repo === 'itaigi') {
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
    const { id, className, match, repos, intros, g0vJsonMap, issueMap, userMap } = this.props
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
    const sourceUrl = (r && r.html_url) || (g0vJson && g0vJson.repository && g0vJson.repository.url)

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
                        : <ProductListItem key={p.name} data={p} />,
                      g0vJson.products
                    )
                }</List>
              </Segment>
              <Segment>
                <h2>重要文件和資訊</h2>
                <List>
                {
                  r && r.homepage &&
                    <List.Item className="github-homepage">
                      <List.Icon name="globe" />
                      <List.Content>
                        <List.Header>首頁</List.Header>
                        <a href={r.homepage}>{ r.homepage }</a>
                      </List.Content>
                    </List.Item>
                }
                {
                  sourceUrl &&
                    <List.Item className="github-source">
                      <List.Icon name="code" />
                      <List.Content>
                        <List.Header>源碼</List.Header>
                        <a href={sourceUrl}>{ sourceUrl }</a>
                      </List.Content>
                    </List.Item>
                }
                </List>
              </Segment>
              <Segment>
                <h2>參與者</h2>
                <List>{
                  map(
                    user =>
                      <List.Item key={user}>
                        <Image avatar src={(userMap[user] && userMap[user].avatar_url) || thumbnail} />
                        <List.Content>
                          <List.Header>{ user }</List.Header>
                          {
                            userMap[user] && userMap[user].html_url &&
                              <a href={userMap[user].html_url || '#'} target="_blank">
                                { userMap[user].html_url }
                              </a>
                          }
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
      const userMap = G.getUserMap(state)

      return { isLoading, repos, intros, g0vJsonMap, issueMap, userMap }
    },
    mapDispatchToProps(actions)
  )
)(RepoPage)
