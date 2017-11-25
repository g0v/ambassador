import React, { PureComponent } from 'react'
import cx from 'classnames'
import { Item, Dropdown, Button } from 'semantic-ui-react'
import VisibilitySensor from 'react-visibility-sensor'
import styles from './index.css'
import * as L from '~/types/logbot'
import * as C from '~/types/color'
import { compose, uniq, filter } from 'ramda'
import moment from 'moment'

const cleanup = compose(uniq, filter(h => typeof h === 'number'))

class LogItem extends PureComponent {
  static defaultProps = {
    className: '',
    options: [],
    disabled: false
  }

  handleVisibility = (isVisible) => {
    const { onVisible } = this.props

    if (isVisible && onVisible) onVisible()
  }

  render() {
    const { id, className, data, options, disabled, onChange, onHide } = this.props
    const { nick = '...', msg = '...', hashtags } = data
    const timeStr = data.time
      ? moment(+data.time * 1000).format(L.LOGBOT_TIME_FORMAT)
      : '00:00:00'
    const color = C.nickname(L.stripNickPrefix(nick))

    return (
      <Item id={id} className={cx(styles.main, className)} >
        <VisibilitySensor onChange={this.handleVisibility} />
        <Item.Content>
          <Item.Description className={styles.log}>
            <span className={styles.time}>{ timeStr }</span>
            <span
              className={styles.nick}
              style={{ color: C.styleFromHSL(color) }}
            >
              { nick }
            </span>
            <span dangerouslySetInnerHTML={{ __html: msg }} />
          </Item.Description>
          {
            !disabled &&
              <Item.Extra>
                <Dropdown
                  fluid multiple search selection closeOnChange
                  placeholder="#hashtag"
                  options={options}
                  value={cleanup(hashtags || [])}
                  onChange={onChange}
                />
              </Item.Extra>
          }
          {
            !disabled &&
              <Button primary floated="right" onClick={onHide}>Hide</Button>
          }
        </Item.Content>
      </Item>
    )
  }
}

export default LogItem
