import React, { PureComponent } from 'react'
import cx from 'classnames'
import { Container } from 'semantic-ui-react'
import DummyIssue from '~/components/DummyIssue'
import { map, range } from 'ramda'
import styles from './index.css'

class IssueListPage extends PureComponent {
  static defaultProps = {
    className: '',
  }

  render() {
    const { id, className } = this.props

    return (
      <Container text id={id} className={cx(styles.main, className)}>{
        map(i => <DummyIssue key={i} className={styles.issue} />, range(0, 5))
      }</Container>
    )
  }
}

export default IssueListPage

