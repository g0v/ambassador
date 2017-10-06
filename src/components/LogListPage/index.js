import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as L from '~/types/logbot'
import * as H from '~/types/hashtag'
import { Container, Item } from 'semantic-ui-react'
import LogItem from '../LogItem'
import { map, difference } from 'ramda'
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
                onAddItem={async (e, item) => {
                  await actions.hashtag.createHashtag(data.value)
                  await actions.hashtag.getHashtags()
                }}
                onChange={async (e, dropdown) => {
                  let ps = []
                  let l

                  const newLinks = difference(dropdown.value, data.hashtags)
                  for (l of newLinks) {
                    ps.push(actions.logbot.linkHashtag(data.id, l))
                  }
                  const goneLinks = difference(data.hashtags, dropdown.value)
                  for (l of goneLinks) {
                    ps.push(actions.logbot.unliknHashtag(data.id, l))
                  }

                  await Promise.all(ps)
                  await actions.logbot.getLog(data.date, data.index)
                }}
              />,
            logs
          )
        }</Item.Group>
      </Container>
    )
  }
}

const hashtagsToOptions = (hashtags) => {
  let result = []

  for (let k in hashtags) {
    result.push(H.toDropdownOption(hashtags[k]))
  }

  return result
}

export default connect(
  state => {
    const hashtags = H.getHashtags(state)
    const options = hashtagsToOptions(hashtags)
    const logs = L.getLogs(state)

    return { logs, options }
  },
  mapDispatchToProps(actions)
)(LogListPage)
