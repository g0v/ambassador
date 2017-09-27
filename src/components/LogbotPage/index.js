import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as L from '~/types/logbot'
import styles from './index.css'

class LogbotPage extends PureComponent {
  static defaultProps = {
    className: '',
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
