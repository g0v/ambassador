import React, { PureComponent } from 'react'
import cx from 'classnames'
import { Item, Dropdown } from 'semantic-ui-react'
import styles from './index.css'

class LogItem extends PureComponent {
  static defaultProps = {
    className: '',
    options: []
  }

  render() {
    const { id, className, data, options } = this.props
    const { nick = '...', msg = '...' } = data

    return (
      <Item id={id} className={cx(styles.main, className)} >
        <Item.Content>
          <Item.Header>{ `${data.date}#${data.index}` }</Item.Header>
          <Item.Description>
            { `${nick}> ` }
            <span dangerouslySetInnerHTML={{ __html: msg }} />
          </Item.Description>
          <Item.Extra>
            <Dropdown
              fluid multiple search selection
              placeholder="#hashtag"
              options={options}
            />
          </Item.Extra>
        </Item.Content>
      </Item>
    )
  }
}

export default LogItem
