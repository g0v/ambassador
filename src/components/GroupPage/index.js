import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as G from '~/types/github'
import { Container, Grid, Segment, Rail, List } from 'semantic-ui-react'
import ProductList from '~/components/ProductList'
import UserList from '~/components/UserList'
import KeywordList from '~/components/KeywordList'
import NeedList from '~/components/NeedList'
import { compose, keys, map } from 'ramda'
import styles from './index.css'

class GroupPage extends PureComponent {
  static defaultProps = {
    className: ''
  }

  render() {
    const { id, className, match, groups } = this.props
    const { params: { group: name } } = match
    const groupName = decodeURIComponent(name)
    const group = groups[groupName] || {}

    return (
      <Container text id={id} className={cx(styles.main, className)}>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Segment>
                <h2>專案成果</h2>
                <ProductList products={group.products} />
              </Segment>
              <Segment>
                <h2>參與者</h2>
                <UserList users={group.contributors} />
              </Segment>

              <Rail close="very" position="left">
                <h1>{ group.name || group.url }</h1>
                <List>{
                  map(
                    thumb =>
                      <List.Item
                        key={thumb}
                        className={styles.thumbnail}
                        style={{ backgroundImage: `url(${thumb})` }}
                      />,
                    group.thumbnails || []
                  )
                }</List>
              </Rail>

              <Rail close="very" position="right">
                <Segment>
                  <h2>相關 repos</h2>
                    <List>{
                      map(
                        url => {
                          const { repo, name } = G.repoNameFromURL(url)

                          // TODO: add repo to the repo path
                          return (
                            <List.Item key={url}>{
                              (repo && name)
                                ? <Link to={`/repos/${name}`}>{ `${repo}/${name}` }</Link>
                                : <a href="url" target="_blank">{ url }</a>
                            }</List.Item>
                          )
                        },
                        group.children || []
                      )
                    }</List>
                </Segment>
                <Segment>
                  <h2>徵求支援</h2>
                  <NeedList needs={group.needs} />
                </Segment>
                <Segment>
                  <h2>關鍵字</h2>
                  <KeywordList keywords={group.keywords} />
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
      const groups = G.getGroupMap(state)

      return { groups }
    },
    mapDispatchToProps(actions)
  )
)(GroupPage)
