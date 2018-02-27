import React, { PureComponent } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as actions from '~/actions'
import { mapDispatchToProps } from '~/types/action'
import styles from './index.css'

class LandingPage extends PureComponent {
  static defaultProps = {
    className: ''
  }

  render() {
    const { id, className } = this.props
    console.log(styles)

    return (
      <div id={id} className={cx(styles.main, className)}>
        <div id={styles.jumbotron}>
          <h1>機器大使</h1>
          <p>Yet Another g0v Hub</p>
        </div>
        <ul className={styles.status}>
          <li>g0v.json 填寫狀況</li>
          <li>Logbot 標記狀況</li>
          <li>外部資源標記狀況</li>
        </ul>
        <ul className={styles.features}>
          <li>
            <h2>彙整</h2>
            <p>機器大使藉 g0v.json 整理了目前專案的開發狀況。可以從<Link to="/groups">專案群組</Link>頁面看見不同專案的現況。</p>
          </li>
          <li>
            <h2>註記</h2>
            <p>機器大使讓你可以在聊天記錄與外部連結上標註相關專案。</p>
            <p>請登入以使用標記工具。</p>
          </li>
          <li>
            <h2>連結</h2>
            <p>機器大使為整理好的資料提供 JSON API ，讓其他服務可以直接取用。</p>
          </li>
        </ul>
        <div className={styles.description}>
          <p>機器大使是<a href="https://grants.g0v.tw"> g0v 公民科技創新獎助金</a>於<a href="https://grants.g0v.tw/projects/5969ed35d60a0d001ed1f7f6"> 2017 年秋季</a>的獲獎提案之一，旨在建立一個專案資料平台，讓坑主與跳坑者們更容易暸解一個專案，並掌握專案脈絡。</p>
          <p>在開發過程中嘗試了：</p>
          <ul>
            <li>將 Logbot 上的聊天記錄與專案關聯起來。</li>
            <li>對專案進行線上訪談。</li>
            <li>標記外部資源，將他們和專案關聯起來。</li>
            <li>更新 g0v.json 的格式，統計 g0v.json 內記載的資訊。</li>
          </ul>
          <p>本計畫於 2018 年春季結案後，將繼續開發下去。更多資訊請見開發日誌。</p>
        </div>
        <div className={styles.footer}>
          <div className={styles.footer__content}>
            <h1>更多資訊</h1>
            <ul>
              <li><a href="https://github.com/g0v/ambassador">源碼庫</a></li>
              <li>開發日誌</li>
            </ul>
            <div className={styles.g0v}>
              powered by g0v
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({}),
  mapDispatchToProps(actions)
)(LandingPage)
