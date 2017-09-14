import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import * as func from '~/types/func'
import * as actions from '~/actions'
import { Button } from 'semantic-ui-react'
import './index.css'

class Main extends PureComponent {
  static defaultProps = {
    className: '',
  }

  render() {
    const { id, className, actions } = this.props

    return (
      <div id={id} className={className}>
        <Button
          primary
          onClick={e => {
            e.preventDefault()
            actions.nop()
          }}
        >
          do nothing!
        </Button>
      </div>
    )
  }
}

export default connect(
  state => state,
  dispatch => ({ actions: func.map(dispatch, actions) })
)(Main)
