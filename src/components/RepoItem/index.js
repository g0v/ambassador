import React, { PureComponent } from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import { Item } from 'semantic-ui-react'
import styles from './index.css'

class RepoItem extends PureComponent {
  static defaultProps = {
    className: ''
  }

  render() {
    const { id, className, data } = this.props

    return (
      <Item.Group>
        <Item id={id} className={cx(styles.main, className)} as={Link} to={`/repos/${data.name}`}>
          <Item.Content>
            <Item.Header>{ data.name }</Item.Header>
            <Item.Meta>{ data.full_name }</Item.Meta>
            <Item.Description>{ data.description }</Item.Description>
          </Item.Content>
        </Item>
      </Item.Group>
    )
  }
}

export default RepoItem
