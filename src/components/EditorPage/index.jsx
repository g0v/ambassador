import React, { PureComponent } from 'react'
import cx from 'classnames'
import styles from './index.css'

class EditorPage extends PureComponent {
  static defalutProps = {
    className: '',
  }

  render() {
    const { id, className } = this.props

    return (
      <div id={id} className={cx(styles.main, className)}>
        <iframe
          className={styles.iframe}
          title="g0v.json editor"
          src="https://g0v.github.io/editor/?repo=g0v/datasmith&name=datasmith&name_zh=%E8%B3%87%E6%96%99%E6%96%B0%E8%81%9E%E7%94%A2%E7%94%9F%E5%99%A8"
          width="100%" height="100%"
        />
      </div>
    )
  }
}

export default EditorPage

