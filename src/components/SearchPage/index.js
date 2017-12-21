import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as L from '~/types/logbot'
import * as S from '~/types/search'
import { Container, Item } from 'semantic-ui-react'
import Pagenator from '../Pagenator'
import LogItem from '../LogItem'
import { map } from 'ramda'
import styles from './index.css'

class SearchPage extends PureComponent {
  static defaultProps = {
    className: ''
  }

  handlePageClick = async (page) => {
    const { value, page: currentPage, actions } = this.props

    if (currentPage === page) return

    try {
      await actions.search.search(value, page)
      await actions.search.page(page)
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    const {
      id, className,
      total, page, logs, logMap, actions
    } = this.props
    const totalPage = Math.ceil(total / S.ROWS_PER_PAGE)

    return (
      <Container text id={id} className={cx(styles.main, className)}>
        {
          logs.length !== 0 &&
            <Pagenator
              className={styles.pagenator}
              page={page}
              total={totalPage}
              onChange={this.handlePageClick}
            />
        }
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
        {
          logs.length !== 0 &&
            <Pagenator
              className={styles.pagenator}
              page={page}
              total={totalPage}
              onChange={this.handlePageClick}
            />
        }
      </Container>
    )
  }
}

export default connect(
  state => {
    const ui = S.getSearch(state)
    const isLoading = ui.isLoading
    const value = ui.value
    const total = ui.total || 0
    const page = ui.page || 0
    const logs = (state && state.search && state.search.logs) || []
    const logMap = L.getLogMap(state)

    return {
      isLoading,
      value,
      total,
      page,
      logs: map(l => logMap[`${l.date}#${l.index}`] || l, logs),
      logMap
    }
  },
  mapDispatchToProps(actions)
)(SearchPage)
