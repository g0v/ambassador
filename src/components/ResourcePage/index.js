import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import { Container } from 'semantic-ui-react'
import styles from './index.css'

class ResourcePage extends PureComponent {
  static defaultProps = {
    className: ''
  }

  render() {
    const { id, className } = this.props

    return (
      <Container text id={id} className={cx(styles.main, className)}>
        resource page
      </Container>
    )
  }
}

export default connect(
  state => ({}),
  mapDispatchToProps(actions)
)(ResourcePage)
