import React, { PureComponent } from 'react'
import cx from 'classnames'
import { Item } from 'semantic-ui-react'
import styles from './index.css'

class IssueItem extends PureComponent {
  static defaultPage = {
    className: '',
  }

  render() {
    const { id, className, data } = this.props

    return (
      <Item id={id} className={cx(styles.main, className)}>
        <Item.Content>
          <Item.Header>{ data.title }</Item.Header>
          <Item.Meta>{ `#${data.number}` }</Item.Meta>
        </Item.Content>
      </Item>
    )
  }
}

export default IssueItem
