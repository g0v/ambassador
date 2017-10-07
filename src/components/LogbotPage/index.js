import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import * as actions from '~/actions'
import { Sidebar, Item } from 'semantic-ui-react'
import { mapDispatchToProps } from '~/types/action'
import * as L from '~/types/logbot'
import * as H from '~/types/hashtag'
import LogItem from '~/components/LogItem'
import { map, uniq, difference } from 'ramda'
import moment from 'moment'
import styles from './index.css'

class LogbotPage extends PureComponent {
  static defaultProps = {
    className: '',
  }

  handleLogbotAction = (e) => {
    if (e.origin !== process.env.LOGBOT_URL) return

    const { date, actions } = this.props

    switch (e.data.type) {
      case 'LOGBOT_DATE': {
        let { date } = e.data
        if (date === 'today') {
          date = moment().format(L.DATE_FORMAT)
        }
        actions.logbot.setDate(date)
        return
      }
      case 'LOGBOT_MESSAGE': {
        actions.logbot.storeLog(date, e.data.index)
        // TODO: notify user that the log has been pushed into the storage
        return
      }
      default:
        return
    }
  }

  componentDidMount() {
    global.addEventListener('message', this.handleLogbotAction)
  }

  componentWillUnmount() {
    global.removeEventListener('message', this.handleLogbotAction)
  }

  render() {
    const { id, className, actions, date, logs, options } = this.props

    return (
      <div id={id} className={cx(styles.main, className)}>
        <Sidebar.Pushable>
          <Sidebar
            className={styles.sidebar}
            animation="overlay"
            direction="right"
            visible={!!logs.length}
            width="very wide"
          >
            <Item.Group divided>{
              map(
                data =>
                  <LogItem
                    key={`${data.date}#${data.index}`}
                    data={data}
                    options={options}
                    onAddItem={async (e, item) => {
                      // XXX: duplicated
                      try {
                        await actions.hashtag.createHashtag(item.value)
                        await actions.hashtag.getHashtags()
                      } catch (err) {
                        console.error(err)
                      }
                    }}
                    onChange={async (e, dropdown) => {
                      // XXX: duplicated
                      try {
                        const hashtags = uniq(data.hashtags || [])
                        let ps = []
                        let l

                        const newLinks = difference(dropdown.value, hashtags)
                        for (l of newLinks) {
                          if (typeof l === 'string') {
                            try {
                              await actions.hashtag.getLastCreatedHashtag()
                            } catch (err) {}
                            const hs = await actions.hashtag.getStoredHashtags()
                            const h = H.findHashtagByContent(hs, l)
                            if (h === undefined) {
                              throw new Error(`Hashtag #${l} not found!`)
                            }
                            l = h.id
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
          </Sidebar>
          <Sidebar.Pusher
            className={styles.iframe}
            as="iframe"
            title="g0v Logbot"
            src={`${process.env.LOGBOT_URL}/channel/g0v.tw/${date}`}
          />
        </Sidebar.Pushable>
      </div>
    )
  }
}

export default connect(
  state => {
    const hashtags = H.getHashtags(state)
    const options = H.toDropdownOptions(hashtags)
    const date = L.getDate(state)
    const logs = L.getLogs(state)

    return { date, logs, options }
  },
  mapDispatchToProps(actions)
)(LogbotPage)
