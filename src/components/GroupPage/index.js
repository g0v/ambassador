import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as G from '~/types/github'
import { Container, Grid, Segment } from 'semantic-ui-react'
import ProductList from '~/components/ProductList'
import { compose, keys } from 'ramda'
import styles from './index.css'

class GroupPage extends PureComponent {
  static defaultProps = {
    className: ''
  }

  async componentDidMount() {
    const { actions, groups } = this.props

    console.log(groups)

    if (keys(groups).length === 0) {
      await actions.github.getGroups('v2')
    }
  }

  render() {
    const { id, className, match, groups } = this.props
    const { params: { group: name } } = match
    const groupName = decodeURIComponent(name)
    const group = groups[groupName] || {}

    return (
      <Container text id={id} className={cx(styles.main, className)}>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Segment>
                <h2>專案成果</h2>
                <ProductList products={group.products} />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    )
  }
}

export default compose(
  withRouter,
  connect(
    state => {
      const groups = G.getGroupMap(state)

      return { groups }
    },
    mapDispatchToProps(actions)
  )
)(GroupPage)
