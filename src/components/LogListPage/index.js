import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as L from '~/types/logbot'
import * as H from '~/types/hashtag'
import { Container, Item } from 'semantic-ui-react'
import LogItem from '../LogItem'
import { map, difference, uniq, reverse } from 'ramda'
import styles from './index.css'

class LogListPage extends PureComponent {
  static defaultProps = {
    className: ''
  }

  render() {
    const { id, className, actions, logs, options } = this.props

    return (
      <Container text id={id} className={cx(styles.main, className)}>
        <Item.Group divided>{
          map(
            data =>
              <LogItem
                key={`${data.date}#${data.index}`}
                data={data}
                options={options}
                onChange={async (e, dropdown) => {
                  try {
                    const hashtags = uniq(data.hashtags || [])
                    let ps = []
                    let l

                    const newLinks = difference(dropdown.value, hashtags)
                    for (l of newLinks) {
                      if (typeof l === 'string') {
                        console.warn('Hashtag creation has been disabled.')
                        continue
                      }
                      ps.push(actions.logbot.linkHashtag(data.id, l))
                    }
                    const goneLinks = difference(hashtags, dropdown.value)
                    for (l of goneLinks) {
                      ps.push(actions.logbot.unlinkHashtag(data.id, l))
                    }

                    await Promise.all(ps)
                    await actions.logbot.getLog(data.date, data.index)
                  } catch (err) {
                    console.error(err)
                  }
                }}
                onHide={async (e) => {
                  await actions.logbot.hide(data.date, data.index)
                }}
              />,
            logs
          )
        }</Item.Group>
      </Container>
    )
  }
}

export default connect(
  state => {
    const hashtags = H.getHashtags(state)
    const options = H.toDropdownOptions(hashtags)
    const logs = reverse(L.getLogs(state))

    return { logs, options }
  },
  mapDispatchToProps(actions)
)(LogListPage)
