import React, { PureComponent } from 'react'
import cx from 'classnames'
import { Modal } from 'semantic-ui-react'
import InfiniteCalendar from 'react-infinite-calendar'
import 'react-infinite-calendar/styles.css'
import theme from './theme'
import moment from 'moment'
import styles from './index.css'

const minDate = moment(process.env.DDAY).toDate()

class CalendarModal extends PureComponent {
  static defaultProps = {
    className: '',
  }

  render() {
    const { id, className, trigger, date, onSelect } = this.props
    const today = new Date()
    const selected = moment(date).toDate()

    return (
      <Modal
        id={id} className={cx(styles.main, className)}
        trigger={trigger}
        size="tiny"
        closeOnDocumentClick
      >
        <Modal.Header>Pick a date</Modal.Header>
        <Modal.Content className={styles.content}>
          <InfiniteCalendar
            width={540}
            height={400}
            minDate={minDate}
            maxDate={today}
            selected={selected}
            theme={theme}
            displayOptions={{
              showHeader: false
            }}
            onSelect={onSelect}
          />
        </Modal.Content>
      </Modal>
    )
  }
}

export default CalendarModal
