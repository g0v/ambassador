import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import * as S from '~/types'
import * as A from '~/types/auth'
import * as G from '~/types/github'
import { EmptyGroupStatus } from '~/types/metadata'
import { Image, Statistic, Header, Item, List } from 'semantic-ui-react'
import MetadataStatistic from '~/components/MetadataStatistic'
import styles from './index.css'
import imageFunnel from '~/images/funnel.svg'
import imageFlags from '~/images/flags.svg'
import imageNetwork from '~/images/network.svg'
import imageAmbassador from '~/images/robot-ambassador.svg'
import imageG0V from '~/images/g0v-2line-transparent-darkbackground-s.png'

class LandingPage extends PureComponent {
  static defaultProps = {
    className: '',
    statistics: S.EmptyStatistics,
    status: EmptyGroupStatus
  }

  handleLogin = async (e) => {
    const { actions } = this.props

    e.preventDefault()

    await actions.auth.login()
    await actions.github.getProfile()
  }

  render() {
    const { id, className, statistics, status, unauthed, isLoggingIn } = this.props

    return (
      <div id={id} className={cx(styles.main, className)}>
        <div className={styles.splash}>
          <div className={styles.splash__content}>
            <Image className={styles.splash__ambassador} size="large" src={imageAmbassador} />
            <Statistic.Group className={styles.status}>
              <Statistic inverted>
                <MetadataStatistic
                  side={200}
                  valid={status.valid}
                  invalid={status.invalid}
                  missing={status.missing}
                />
                <Statistic.Label>g0v.json</Statistic.Label>
              </Statistic>
              <Statistic inverted color="violet">
                <Statistic.Value className={styles.status__value}>
                  { statistics.taggedLogs }
                </Statistic.Value>
                <Statistic.Label>已標記的聊天記錄</Statistic.Label>
              </Statistic>
              <Statistic inverted color="pink">
                <Statistic.Value className={styles.status__value}>
                  { statistics.taggedResources }
                </Statistic.Value>
                <Statistic.Label>已標記的外部資源</Statistic.Label>
              </Statistic>
            </Statistic.Group>
          </div>
        </div>
        <div className={styles.content}>
          <Item.Group className={styles.features} divided>
            <Item>
              <Item.Image size="tiny" src={imageFunnel} />
              <Item.Content>
                <Item.Header>彙整</Item.Header>
                <Item.Description>
                  <p>機器大使藉 g0v.json 整理了目前專案的開發狀況。可以從<Link to="/groups">專案群組</Link>頁面看見不同專案的現況。</p>
                </Item.Description>
              </Item.Content>
            </Item>
            <Item>
              <Item.Image size="tiny" src={imageFlags} />
              <Item.Content>
                <Item.Header>註記</Item.Header>
                <Item.Description>
                  <p>機器大使讓你可以在聊天記錄與外部連結上標註相關專案。</p>
                  {
                    unauthed && (
                      isLoggingIn
                        ? <p>請以 GitHub 帳號登入以使用標記工具。</p>
                        : <p>請以 GitHub 帳號<a href="#" onClick={this.handleLogin}>登入</a>以使用標記工具。</p>
                    )
                  }
                </Item.Description>
              </Item.Content>
            </Item>
            <Item>
              <Item.Image size="tiny" src={imageNetwork} />
              <Item.Content>
                <Item.Header>連結</Item.Header>
                <Item.Description>
                  <p>機器大使為整理好的資料提供 JSON API ，讓其他服務可以直接取用。</p>
                </Item.Description>
              </Item.Content>
            </Item>
          </Item.Group>
          <div className={styles.description}>
            <Header as="h2">
              機器大使
              <Header.Subheader>Yet Another g0v Hub</Header.Subheader>
            </Header>
            <p>機器大使是<a href="https://grants.g0v.tw"> g0v 公民科技創新獎助金</a>於<a href="https://grants.g0v.tw/projects/5969ed35d60a0d001ed1f7f6"> 2017 年秋季</a>的獲獎提案之一，旨在建立一個專案資料平台，讓坑主與跳坑者們更容易暸解一個專案，並掌握專案脈絡。</p>
            <p>在開發過程中嘗試了：</p>
            <ul>
              <li>將 Logbot 上的聊天記錄與專案關聯起來。</li>
              <li>對專案進行線上訪談。</li>
              <li>標記外部資源，將他們和專案關聯起來。</li>
              <li>更新 g0v.json 的格式，統計 g0v.json 內記載的資訊。</li>
            </ul>
            <p>本計畫於 2018 年春季結案後，將繼續開發下去。</p>
          </div>
          <div className={styles.footer}>
            <div className={styles.footer__content}>
              <Header as="h2" inverted>更多資訊</Header>
              <List>
                <List.Item>
                  <List.Icon name="github" />
                  <List.Content>
                    <a href="https://github.com/g0v/ambassador">源碼庫</a>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon name="book" />
                  <List.Content>
                    <a href="https://github.com/g0v/ambassador/blob/master/docs/README.md">開發日誌</a>
                  </List.Content>
                </List.Item>
              </List>
              <Image className={styles.g0v} size="tiny" src={imageG0V} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => {
    const statistics = S.getStatistics(state)
    const status = G.getGroupStatus(state)
    const unauthed = !A.getAccessToken(state)
    const isLoggingIn = A.isLoggingIn(state)

    return { statistics, status, unauthed, isLoggingIn }
  },
  mapDispatchToProps(actions)
)(LandingPage)
