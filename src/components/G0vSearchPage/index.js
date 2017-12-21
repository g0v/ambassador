import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as L from '~/types/logbot'
import * as S from '~/types/search'
import { Container, List } from 'semantic-ui-react'
import Pagenator from '../Pagenator'
import { map, take } from 'ramda'
import moment from 'moment'
import styles from './index.css'

const DATETIME_FORMAT = `${L.DATE_FORMAT} ${L.TIME_FORMAT}`

class G0vSearchPage extends PureComponent {
  static defaultProps = {
    className: ''
  }

  handlePageClick = async (page) => {
    const { value, page: currentPage, actions } = this.props

    if (currentPage === page) return

    try {
      await actions.search.g0vSearch(value, page)
      await actions.search.page(page)
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    const { id, className, total, page, logs } = this.props
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
        <List>{
          map(
            data => {
              const { id, title, content, url, updated_at, source } = data
              const datetime = moment(updated_at * 1000).format(DATETIME_FORMAT)
              let icon

              switch (source) {
                case 'logbot':
                  icon = 'book'
                  break
                case 'hackpad':
                  icon = 'file text'
                  break
                case 'issues':
                  icon = 'exclamation circle'
                  break
                case 'repo':
                  icon = 'code'
                  break
                default:
                  icon = 'question'
              }

              return (
                <List.Item key={id}>
                  <List.Icon name={icon} />
                  <List.Content>
                    <List.Header as="a" href={url} target="_blank" title={datetime}>
                      { title }
                    </List.Header>
                    <List.Description>
                      { take(140, content) }
                    </List.Description>
                  </List.Content>
                </List.Item>
              )
            },
            logs
          )
        }</List>
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
    const logs = (state && state.search && state.search.g0v) || []

    return { isLoading, value, total, page, logs }
  },
  mapDispatchToProps(actions)
)(G0vSearchPage)
