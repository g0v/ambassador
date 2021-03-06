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
import { Container, Image, Statistic, Header, Item, List, Card, Icon } from 'semantic-ui-react'
import MetadataStatistic from '~/components/MetadataStatistic'
import styles from './index.css'
import imageFunnel from '~/images/funnel.svg'
import imageFlags from '~/images/flags.svg'
import imageNetwork from '~/images/network.svg'
import imageAmbassador from '~/images/robot-ambassador.svg'
import imageG0V from '~/images/powered-by-g0v.svg'

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
          <Container className={styles.splash__content}>
            <Image className={styles.splash__ambassador} size="large" src={imageAmbassador} />
            <Statistic.Group className={styles.splash__status}>
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
                <Statistic.Value>
                  { statistics.taggedLogs }
                </Statistic.Value>
                <Statistic.Label>已標記的聊天記錄</Statistic.Label>
              </Statistic>
              <Statistic inverted color="pink">
                <Statistic.Value>
                  { statistics.taggedResources }
                </Statistic.Value>
                <Statistic.Label>已標記的外部資源</Statistic.Label>
              </Statistic>
            </Statistic.Group>
          </Container>
        </div>

        <div className={styles.content}>
          <Container text>
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
                關於機器大使
                <Header.Subheader>Yet Another g0v Hub</Header.Subheader>
              </Header>
              <p>機器大使原計畫名為 Yet Another g0v Hub ，是<a href="https://grants.g0v.tw"> g0v 公民科技創新獎助金</a>於<a href="https://grants.g0v.tw/projects/5969ed35d60a0d001ed1f7f6"> 2017 年秋季</a>的獲獎提案之一。</p>
              <p>2013 和 2014 年的 g0v 專案給我很多回憶，但是這些專案不見得繼續維護，也看過很多專案開了坑卻無法繼續下去。我想整理這些專案，為他們多添加一些脈絡，也許會有更多人填坑。</p>
              <p>我希望將整理資料的工具，視為整理資料的人的延伸。本來打算以貢獻者的社群動態為中心，將貢獻者在社群網站、 GitHub 、 Slack 的活動情況整理在獨立的儀表板上。也在<a href="https://g0v.hackpad.tw/ep/group/HIGzdedxyd4">線上訪問過專案</a>。目前與揪松團<a href="https://hackmd.io/s/Bk8yOCv-M">討論</a>後，修正了方向，以整理與呈現 g0v.json 記載的專案內容為主，標記外部資源為輔。</p>
              <p>本計畫於 2018 年春季結案後，將繼續開發下去。</p>
            </div>
            <div className={styles.contributors}>
              <Header as="h2">
                開發者
                <Header.Subheader>Contributors</Header.Subheader>
              </Header>
              <Card.Group centered>
                <Card>
                  <Card.Content>
                    <Image
                      floated="right"
                      size="mini"
                      src="https://avatars2.githubusercontent.com/u/1164470?s=460&v=4"
                    />
                    <Card.Header as="a" href="https://github.com/caasi" target="_blank" rel="noopener noreferrer">
                      caasi
                    </Card.Header>
                    <Card.Meta>卡西</Card.Meta>
                    <Card.Description>
                      主要開發者，計畫發起人，打算一直整理資料的倒霉鬼 XD
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <a href="https://twitter.com/caasih" target="_blank" rel="noopener noreferrer">
                      <Icon name="twitter" />
                    </a>
                    <a href="https://facebook.com/caasihuang" target="_blank" rel="noopener noreferrer">
                      <Icon name="facebook" />
                    </a>
                  </Card.Content>
                </Card>
              </Card.Group>
              <Card.Group centered>
                <Card>
                  <Card.Content>
                    <Image
                      floated="right"
                      size="mini"
                      src="https://avatars1.githubusercontent.com/u/2672307?s=460&v=4"
                    />
                    <Card.Header as="a" href="https://github.com/zbryikt" target="_blank" rel="noopener noreferrer">
                      zbryikt
                    </Card.Header>
                    <Card.Meta>科比</Card.Meta>
                    <Card.Description>
                      感謝科比大大贊助了 brounce, breath, rubber 這些可愛的動畫圖。
                    </Card.Description>
                  </Card.Content>
                </Card>
                <Card>
                  <Card.Content>
                    <Image
                      floated="right"
                      size="mini"
                      src="https://avatars1.githubusercontent.com/u/5170081?s=460&v=4"
                    />
                    <Card.Header as="a" href="https://github.com/jbytw" target="_blank" rel="noopener noreferrer">
                      jackie
                    </Card.Header>
                    <Card.Meta>jbytw</Card.Meta>
                    <Card.Description>
                      感謝 jbytw 改錯字。
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Card.Group>
            </div>
            <div className={styles.license}>
              <Header as="h2">
                授權
                <Header.Subheader>License</Header.Subheader>
              </Header>
              <p>本專案產出的程式碼與相關圖片以 <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener noreferrer">CC0-1.0</a> 「公眾領域貢獻宣告」釋出。</p>
              <p>本專案改作的 g0v.json 按其原專案授權釋出</p>
              <p>本專案使用到的、來自其他專案的圖片按其原授權釋出</p>
            </div>
          </Container>

          <div className={styles.footer}>
            <Container text className={styles.footer__content}>
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
              <a className={styles.g0v} href="https://grants.g0v.tw/power/" target="_blank" rel="noopener noreferrer">
                <Image size="small" src={imageG0V} title="powered by g0v" />
              </a>
            </Container>
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
