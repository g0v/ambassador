import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as L from '~/types/logbot'
import moment from 'moment'
import styles from './index.css'

class LogbotPage extends PureComponent {
  static defaultProps = {
    className: '',
  }

  handleLogbotAction = (e) => {
    if (e.origin !== 'https://logbot.g0v.tw') return

    const { actions } = this.props

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
        // TODO: push current message index and its content to a stack
        console.log('message index', e.data.index)
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
    const { id, className, date } = this.props

    return (
      <div id={id} className={cx(styles.main, className)}>
        <iframe
          className={styles.iframe}
          title="g0v Logbot"
          src={`https://logbot.g0v.tw/channel/g0v.tw/${date}`}
        />
      </div>
    )
  }
}

export default connect(
  state => {
    const date = L.getDate(state)

    return { date }
  },
  mapDispatchToProps(actions)
)(LogbotPage)
