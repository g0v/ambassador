import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import { Container, Form, Button, Dropdown, Divider } from 'semantic-ui-react'
import styles from './index.css'

class ResourcePage extends PureComponent {
  static defaultProps = {
    className: ''
  }

  async componentDidMount() {
    const { actions } = this.props

    await actions.resource.list()
  }

  render() {
    const { id, className, actions } = this.props

    return (
      <Container text id={id} className={cx(styles.main, className)}>
        <Form>
          <Form.Input label="Resource URI" />
          <Form.Field>
            <Dropdown
              fluid multiple search selection closeOnChange
              placeholder="#hashtag"
            />
          </Form.Field>
          <Button
            onClick={async (e) => {
              e.preventDefault()
              await actions.resource.create('http://g0v.tw')
            }}
          >
            Submit
          </Button>
        </Form>
        <Divider horizontal>Resources</Divider>
      </Container>
    )
  }
}

export default connect(
  state => ({}),
  mapDispatchToProps(actions)
)(ResourcePage)
