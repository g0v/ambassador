import React, { PureComponent } from 'react'
import cx from 'classnames'
import { List } from 'semantic-ui-react'
import styles from './index.css'

class ProductListItem extends PureComponent {
  static defaultProps = {
    className: ''
  }

  render() {
    const { id, className, data } = this.props
    const { type, subtype, name, url = '#' } = data
    let icon

    switch (type) {
      case 'website':
        icon = 'globe'
        break
      case 'app':
        switch (subtype) {
          case 'android':
            icon = 'android'
            break
          case 'ios':
            icon = 'apple'
            break
          case 'firefox':
            icon = 'mobile'
            break
          case 'desktop':
            icon = 'desktop'
            break
          default:
            icon = 'window maximize'
        }
        break
      case 'bot':
        switch (subtype) {
          case 'facebook':
            icon = 'facebook official'
            break
          case 'line':
            icon = 'commenting'
            break
          case 'slack':
            icon = 'slack'
            break
          case 'telegram':
            icon = 'telegram'
            break
          case 'wechat':
            icon = 'weixin'
            break
          default:
            icon = 'commenting'
        }
        break
      case 'extension':
        switch (subtype) {
          case 'chrome':
            icon = 'chrome'
            break
          case 'firefox':
            icon = 'firefox'
            break
          case 'safari':
            icon = 'safari'
            break
          case 'visualstudio':
          case 'vscode':
          case 'sublime':
          case 'atom':
          case 'vim':
          case 'emacs':
            icon = 'code'
            break
          default:
            icon = 'plug'
            break
        }
        break
      case 'library':
        icon = 'university'
        break
      case 'api':
        icon = 'cloud'
        break
      case 'data':
        icon = 'database'
        break
      case 'script':
        icon = 'cog'
        break
      default:
        icon = 'question'
    }

    return (
      <List.Item id={id} className={cx(styles.main, className)}>
        <List.Icon name={icon} />
        <List.Content>
          <a href={url} target="_blank">{ name }</a>
        </List.Content>
      </List.Item>
    )
  }
}

export default ProductListItem
