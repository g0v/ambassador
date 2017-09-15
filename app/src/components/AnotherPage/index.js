import React, { PureComponent } from 'react'
import cx from 'classnames'
import { Container } from 'semantic-ui-react'
import styles from './index.css'

class AnotherPage extends PureComponent {
  static defaultProps = {
    className: '',
  }

  render() {
    const { id, className } = this.props

    return (
      <Container text id={id} className={cx(styles.main, className)}>
        just another page
      </Container>
    )
  }
}

export default AnotherPage

