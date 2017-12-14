import React, { PureComponent } from 'react'
import cx from 'classnames'
import { Item, Dropdown } from 'semantic-ui-react'
import VisibilitySensor from 'react-visibility-sensor'
import styles from './index.css'
import { compose, uniq } from 'ramda'

const cleanup = compose(uniq)

class ResourceItem extends PureComponent {
  static defaultProps = {
    className: '',
    options: []
  }

  handleVisibility = (isVisible) => {
    const { onVisible } = this.props

    if (isVisible && onVisible) onVisible()
  }

  render() {
    const { id, className, data, options } = this.props
    const { uri = '...', hashtags } = data

    return (
      <Item id={id} className={cx(styles.main, className)}>
        <VisibilitySensor onChange={this.handleVisibility} />
        <Item.Content>
          <Item.Description>
            <a href={uri} target="_blank">{ uri }</a>
          </Item.Description>
        </Item.Content>
        <Item.Extra>
          <Dropdown
            fluid multiple search selection closeOnChange disabled
            placeholder="#hashtag"
            options={options}
            value={cleanup(hashtags || [])}
          />
        </Item.Extra>
      </Item>
    )
  }
}

export default ResourceItem
