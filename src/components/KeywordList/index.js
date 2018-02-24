import React, { PureComponent } from 'react'
import cx from 'classnames'
import { List } from 'semantic-ui-react'
import { map } from 'ramda'
import styles from './index.css'

class KeywordList extends PureComponent {
  static defaultProps = {
    className: '',
    keywords: []
  }

  render() {
    const { id, className, keywords } = this.props

    return (
      <List id={id} className={cx(styles.main, className)}>{
        map(
          keyword => <List.Item key={keyword}>{ keyword }</List.Item>,
          keywords
        )
      }</List>
    )
  }
}

export default KeywordList
