import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as R from '~/types/resource'
import {
  Container,
  Form,
  Button,
  Dropdown,
  Divider,
  Grid,
  Item,
  Popup
} from 'semantic-ui-react'
import { map, addIndex } from 'ramda'
import styles from './index.css'

const COLUMN_NUM = 2
const idxMap = addIndex(map)

class ResourcePage extends PureComponent {
  static defaultProps = {
    className: ''
  }

  async componentDidMount() {
    const { actions } = this.props

    await actions.resource.list()
  }

  render() {
    const {
      id, className, actions,
      isLoading, isCreating, resources, error
    } = this.props

    let btn
    if (error) {
      const content = error.response.status === 409
        ? 'URI exists!'
        : 'Something is wrong!'
      btn =
        <Button
          negative
          disabled={isLoading || isCreating}
          onClick={async (e) => {
            e.preventDefault()
            await actions.resource.dismiss()
          }}
        >
          Error
        </Button>
      btn =
        <Popup
          inverted
          trigger={btn}
          content={content}
          on="hover"
          position="right center"
        />
    } else {
      btn =
        <Button
          primary
          disabled={isLoading || isCreating}
          onClick={async (e) => {
            e.preventDefault()
            await actions.resource.create('http://g0v.tw')
          }}
        >
          Submit
        </Button>
    }

    const rowCount = Math.floor(resources.length / COLUMN_NUM)
    const r = resources.length % COLUMN_NUM
    let as = []
    let i
    let j
    for (i = 0; i < rowCount; i++) {
      let bs = []
      for (j = 0; j < COLUMN_NUM; j++) {
        bs.push(resources[i * COLUMN_NUM + j])
      }
      as.push(bs)
    }
    j = i * COLUMN_NUM
    let cs = []
    for (i = 0; i < r; i++) {
      cs.push(resources[j + i])
    }
    if (cs.length) as.push(cs)

    return (
      <Container text id={id} className={cx(styles.main, className)}>
        <Form>
          <Form.Input label="Resource URI" disabled={isLoading || isCreating} />
          <Form.Field>
            <Dropdown
              fluid multiple search selection closeOnChange
              placeholder="#hashtag"
              options={[]}
              disabled={isLoading || isCreating}
            />
          </Form.Field>
          { btn }
        </Form>
        <Divider horizontal>Resources</Divider>
        <Grid columns={COLUMN_NUM}>{
          idxMap(
            (a, i) =>
              <Grid.Row key={i}>{
                idxMap(
                  (aa, j) =>
                    <Grid.Column key={j}>
                      <Item>
                        <Item.Content>
                          <Item.Header>{ aa.uri }</Item.Header>
                        </Item.Content>
                      </Item>
                    </Grid.Column>,
                  a
                )
              }</Grid.Row>,
            as
          )
        }</Grid>
      </Container>
    )
  }
}

export default connect(
  state => {
    const isLoading = R.isLoading(state)
    const isCreating = R.isCreating(state)
    const resources = R.getResources(state)
    const error = R.getError(state)

    return { isLoading, isCreating, resources, error }
  },
  mapDispatchToProps(actions)
)(ResourcePage)
