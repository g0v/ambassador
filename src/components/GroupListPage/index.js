import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as actions from '~/actions'
import * as G from '~/types/github'
import { mapDispatchToProps } from '~/types/action'
import { Container, Card, Image, Icon } from 'semantic-ui-react'
import { compose, map, keys, filter } from 'ramda'
import styles from './index.css'

const GroupCard = ({ group, url }) => {
  // TODO: add a placeholder image
  const thumbnail = group && group.thumbnails && group.thumbnails[0]
  let groupName = group.name_zh || group.name
  if (!groupName) {
    const { repo, name } = G.repoNameFromURL(url)
    groupName = `${repo}/${name}`
  }
  const desc = group.description_zh || group.description || '沒有人寫介紹！'
  const headCount = group.contributors.length
  const productCount = group.children.length

  return (
    <Card>
      { thumbnail && <Image src={thumbnail} /> }
      <Card.Content>
        <Card.Header
          as={Link}
          to={`/groups/${encodeURIComponent(url)}`}
        >
          { groupName } 專案集
        </Card.Header>
        <Card.Meta>{ (groupName !== group.name) && group.name }</Card.Meta>
        <Card.Description>{ desc }</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Icon name="user" />{ headCount } 位貢獻者
        <br />
        <Icon name="cubes" />{ productCount } 個子專案
      </Card.Content>
    </Card>
  )
}

class GroupListPage extends PureComponent {
  static defaultProps = {
    className: ''
  }

  render() {
    const { id, className, groups } = this.props

    return (
      <Container id={id} className={cx(styles.main, className)}>
        <Card.Group itemsPerRow={3}>{
          compose(
            map(url => <GroupCard key={url} group={groups[url]} url={url} />),
            filter(k => k !== 'status'),
            keys
          )(groups)
        }</Card.Group>
      </Container>
    )
  }
}

export default connect(
  state => {
    const groups = G.getGroupMap(state)

    return { groups }
  },
  mapDispatchToProps(actions)
)(GroupListPage)
