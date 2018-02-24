import React, { PureComponent } from 'react'
import cx from 'classnames'
import { List } from 'semantic-ui-react'
import { map } from 'ramda'
import styles from './index.css'

const getIcon = (need) => {
  switch (need) {
    case 'designer':
      return 'eye'
    case 'writer':
      return 'pencil'
    case 'programmer':
      return 'code'
    case 'money':
      return 'money'
    case 'txt':
      return 'pencil'
    default:
      return 'question'
  }
}

class NeedList extends PureComponent {
  static defaultProps = {
    className: '',
    needs: []
  }

  render() {
    const { id, className, needs } = this.props

    return (
      <List id={id} className={cx(styles.main, className)}>{
        map(
          need =>
            <List.Item key={need}>
              <List.Icon name={getIcon(need)} />
              <List.Content>{ need }</List.Content>
            </List.Item>,
          needs
        )
      }</List>
    )
  }
}

export default NeedList
