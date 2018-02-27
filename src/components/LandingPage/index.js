import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import { Container } from 'semantic-ui-react'
import styles from './index.css'

class LandingPage extends PureComponent {
  static defaultProps = {
    className: ''
  }

  render() {
    const { id, className } = this.props

    return (
      <Container id={id} className={cx(styles.main, className)}>
        the landing page
      </Container>
    )
  }
}

export default connect(
  state => ({}),
  mapDispatchToProps(actions)
)(LandingPage)
