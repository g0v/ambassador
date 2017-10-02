import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as L from '~/types/logbot'
import { Container, Item } from 'semantic-ui-react'
import LogItem from '../LogItem'
import { map } from 'ramda'
import styles from './index.css'

class LogListPage extends PureComponent {
  static defaultProps = {
    className: ''
  }

  render() {
    const { id, className, logs } = this.props

    return (
      <Container text id={id} className={cx(styles.main, className)}>
        <Item.Group divided>{
          map(data => <LogItem key={`${data.date}#${data.index}`} data={data} />, logs)
        }</Item.Group>
      </Container>
    )
  }
}

export default connect(
  state => {
    const logs = L.getLogs(state)
    return { logs }
  },
  mapDispatchToProps(actions)
)(LogListPage)
