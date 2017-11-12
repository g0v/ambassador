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

class SearchPage extends PureComponent {
  static defaultProps = {
    className: ''
  }

  render() {
    const { id, className, logs, logMap, actions } = this.props

    return (
      <Container text id={id} className={cx(styles.main, className)}>
        <Item.Group divided>{
          map(
            data =>
              <LogItem
                disabled
                key={`${data.date}#${data.index}`}
                data={data}
                onVisible={() => {
                  const key = `${data.date}#${data.index}`

                  if (!logMap[key]) {
                    actions.logbot.getLog(data.date, data.index)
                  }
                }}
              />
            ,
            logs
          )
        }</Item.Group>
      </Container>
    )
  }
}

export default connect(
  state => {
    const logs = (state && state.search && state.search.logs) || []
    const logMap = L.getLogMap(state)

    return { logs: map(l => logMap[`${l.date}#${l.index}`] || l, logs), logMap }
  },
  mapDispatchToProps(actions)
)(SearchPage)
