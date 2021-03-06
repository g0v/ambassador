import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as R from '~/types/resource'
import * as H from '~/types/hashtag'
import {
  Container,
  Form,
  Button,
  Dropdown,
  Divider,
  Grid,
  Popup,
  Input
} from 'semantic-ui-react'
import ResourceItem from '../ResourceItem'
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
      isLoading, isCreating, resources, error,
      uri, value, options
    } = this.props

    let btn
    if (error) {
      const content = error.response.status === 409
        ? '重複的 URI ！'
        : '有什麼出錯了！'
      btn =
        <Button
          negative
          disabled={isLoading || isCreating}
          onClick={async (e) => {
            e.preventDefault()
            await actions.resource.dismiss()
          }}
        >
          錯誤
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
            await actions.resource.create(uri, value)
          }}
        >
          新增
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
        <h1>外部資源標記工具</h1>
        <Form>
          <Form.Field>
            <label>外部資源 URI</label>
            <Input
              label="http(s)://"
              value={uri}
              disabled={isLoading || isCreating}
              onChange={(e, data) => {
                actions.resource.change(data.value)
              }}
            />
          </Form.Field>
          <Form.Field>
            <Dropdown
              fluid multiple search selection closeOnChange
              placeholder="#hashtag"
              options={options}
              value={value}
              disabled={isLoading || isCreating}
              onChange={async (e, dropdown) => {
                try {
                  await actions.resource.createLink(dropdown.value)
                } catch (err) {
                  console.error(err)
                }
              }}
            />
          </Form.Field>
          { btn }
        </Form>
        <Divider horizontal>外部資源列表</Divider>
        <Grid columns={COLUMN_NUM}>{
          idxMap(
            (a, i) =>
              <Grid.Row key={i}>{
                idxMap(
                  (aa, j) =>
                    <Grid.Column key={j}>
                      <ResourceItem
                        data={aa}
                        options={options}
                        onVisible={async () => {
                          if (aa.hashtags !== undefined) return
                          try {
                            await actions.resource.get(aa.id)
                          } catch (error) {
                            console.error(error)
                          }
                        }}
                      />
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
    const uri = R.getResourceURI(state)
    const value = R.getHashtags(state)
    const hashtags = H.getHashtags(state)
    const options = H.toDropdownOptions(hashtags)

    return { isLoading, isCreating, resources, error, uri, value, options }
  },
  mapDispatchToProps(actions)
)(ResourcePage)
