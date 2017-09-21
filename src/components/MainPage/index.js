import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import * as func from '~/types/func'
import * as actions from '~/actions'
import { Container, Button } from 'semantic-ui-react'
import styles from './index.css'

class MainPage extends PureComponent {
  static defaultProps = {
    className: '',
  }

  render() {
    const { id, className, actions } = this.props

    return (
      <Container text id={id} className={cx(styles.main, className)}>
        <Button
          primary
          onClick={e => {
            e.preventDefault()
            actions.nop()
          }}
        >
          do nothing!
        </Button>
      </Container>
    )
  }
}

export default connect(
  state => ({}),
  dispatch => ({ actions: func.map(dispatch, actions) })
)(MainPage)

