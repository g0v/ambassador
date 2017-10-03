import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as G from '~/types/github'
import * as L from '~/types/logbot'
import * as H from '~/types/hashtag'
import { Container, Item } from 'semantic-ui-react'
import LogItem from '../LogItem'
import { map, uniq } from 'ramda'
import styles from './index.css'

class LogListPage extends PureComponent {
  static defaultProps = {
    className: ''
  }

  render() {
    const { id, className, logs, options } = this.props

    return (
      <Container text id={id} className={cx(styles.main, className)}>
        <Item.Group divided>{
          map(
            data =>
              <LogItem key={`${data.date}#${data.index}`} data={data} options={options} />,
            logs
          )
        }</Item.Group>
      </Container>
    )
  }
}

const hashtagsToOptions = (hashtags) => {
  let result = []

  for (let k in hashtags) {
    result.push(H.toDropdownOption(hashtags[k]))
  }

  return result
}

export default connect(
  state => {
    const logs = L.getLogs(state)
    const repos = G.getRepoList(state)
    const hashtags = H.getHashtags(state)
    const options = uniq([
      ...map(G.toDropdownOption, repos),
      ...hashtagsToOptions(hashtags)
    ])

    return { logs, options }
  },
  mapDispatchToProps(actions)
)(LogListPage)
