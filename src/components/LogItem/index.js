import React, { PureComponent } from 'react'
import cx from 'classnames'
import { Item, Dropdown, Button } from 'semantic-ui-react'
import styles from './index.css'
import * as L from '~/types/logbot'
import { compose, uniq, filter } from 'ramda'
import moment from 'moment'

const cleanup = compose(uniq, filter(h => typeof h === 'number'))

class LogItem extends PureComponent {
  static defaultProps = {
    className: '',
    options: []
  }

  render() {
    const { id, className, data, options, onAddItem, onChange, onHide } = this.props
    const { nick = '...', msg = '...', hashtags } = data
    const timeStr = moment(+data.time * 1000).format(`${L.DATE_FORMAT} ${L.TIME_FORMAT}`)

    return (
      <Item id={id} className={cx(styles.main, className)} >
        <Item.Content>
          <Item.Description className={styles.log}>
            <span className={styles.nick} title={timeStr}>{`${nick}>`}</span>
            &nbsp;
            <span dangerouslySetInnerHTML={{ __html: msg }} />
          </Item.Description>
          <Item.Extra>
            <Dropdown
              fluid multiple search selection allowAdditions
              placeholder="#hashtag"
              options={options}
              value={cleanup(hashtags)}
              onAddItem={onAddItem}
              onChange={onChange}
            />
          </Item.Extra>
          <Button primary floated="right" onClick={onHide}>Hide</Button>
        </Item.Content>
      </Item>
    )
  }
}

export default LogItem
