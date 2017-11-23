import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as L from '~/types/logbot'
import * as S from '~/types/search'
import { Container, Item, Button } from 'semantic-ui-react'
import LogItem from '../LogItem'
import { map } from 'ramda'
import styles from './index.css'

class SearchPage extends PureComponent {
  static defaultProps = {
    className: ''
  }

  async handlePageClick(page) {
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

    // TODO: create a pagenation component
    return (
      <Container text id={id} className={cx(styles.main, className)}>
        {
          logs.length !== 0 &&
            <Button.Group className={styles.pagenator}>
              <Button
                icon="triangle left"
                disabled={page === 0}
                onClick={() => this.handlePageClick(page - 1)}
              />
              {
                totalPage > 1 &&
                  <Button
                    active={page === 0}
                    onClick={() => this.handlePageClick(0)}
                  >
                    1
                  </Button>
              }
              {
                totalPage > 2
                  ? (page === 0 || page === 1 || page === 2)
                      ? <Button
                          active={page === 1}
                          onClick={() => this.handlePageClick(1)}
                        >
                          2
                        </Button>
                      : <Button disabled>&#8230;</Button>
                  : null
              }
              {
                totalPage > 3
                  ? (page === 0 || page === 1)
                      ? <Button onClick={() => this.handlePageClick(2)}>3</Button>
                      : (page === (totalPage - 2) || page === (totalPage - 1))
                          ? <Button onClick={() => this.handlePageClick(totalPage - 3)}>{ totalPage - 2 }</Button>
                          : <Button className={styles.current} active>{ page + 1 }</Button>
                  : null
              }
              {
                totalPage > 4
                  ? (page === (totalPage - 3) || page === (totalPage - 2) || page === (totalPage - 1))
                      ? <Button
                          active={page === (totalPage - 2)}
                          onClick={() => this.handlePageClick(totalPage - 2)}
                        >
                          { totalPage - 1 }
                        </Button>
                      : <Button disabled>&#8230;</Button>
                  : null
              }
              {
                totalPage > 5 &&
                  <Button
                    active={page === (totalPage - 1)}
                    onClick={() => this.handlePageClick(totalPage - 1)}
                  >
                    { totalPage }
                  </Button>
              }
              <Button
                icon="triangle right"
                disabled={page >= (totalPage - 1)}
                onClick={() => this.handlePageClick(page + 1)}
              />
            </Button.Group>
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
