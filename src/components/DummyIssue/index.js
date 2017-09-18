import React, { PureComponent } from 'react'
import cx from 'classnames'
import styles from './index.css'

class DummyIssue extends PureComponent {
  static defaultPage = {
    className: '',
  }

  render() {
    const { id, className, onClick } = this.props

    return (
      <div
        id={id} className={cx(styles.main, className)}
        onClick={onClick}
      >
      </div>
    )
  }
}

export default DummyIssue

