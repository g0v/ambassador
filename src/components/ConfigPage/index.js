import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as C from '~/types/config'
import * as A from '~/types/auth'
import * as G from '~/types/github'
import { Container, Form, Popup, Button } from 'semantic-ui-react'
import styles from './index.css'

class ConfigPage extends PureComponent {
  static defaultProps = {
    className: ''
  }

  onSetToken = (e) => {
    const { actions, token } = this.props

    e.preventDefault()

    try {
      actions.config.token(token)
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    const { id, className, token, email, isLoading } = this.props
    const btn =
      <Button
        negative
        onClick={this.onSetToken}
        disabled={isLoading || !token || !email}
      >
        用我的 GitHub token 抓資料
      </Button>

    return (
      <Container text id={id} className={cx(styles.main, className)}>
        <h1>設定</h1>
        <Form>
          <Form.Field>
            <label>電子郵件</label>
            <input value={email} disabled />
          </Form.Field>
          <Form.Field>
            <label>GitHub Access Token</label>
            <input value={token} disabled />
          </Form.Field>
          <Popup
            position="bottom left"
            trigger={btn}
          >
            讓後台用這個帳號的 GitHub token 來存取 GitHub API 。只有管理員可以使用此功能。
          </Popup>
        </Form>
      </Container>
    )
  }
}

export default connect(
  state => {
    const isLoading = C.isUpdatingToken(state)
    const token = A.getAccessToken(state)
    const email = G.getEmail(state)

    return { token, email, isLoading }
  },
  mapDispatchToProps(actions)
)(ConfigPage)
