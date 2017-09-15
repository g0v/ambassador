import React, { PureComponent } from 'react'
import cx from 'classnames'
import styles from './index.css'

class DummyComment extends PureComponent {
  static defaultPage = {
    className: '',
  }

  render() {
    const { id, className } = this.props

    return (
      <div id={id} className={cx(styles.main, className)}>
      </div>
    )
  }
}

export default DummyComment

