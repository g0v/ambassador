import React, { PureComponent } from 'react'
import cx from 'classnames'
import { Container, Grid, Comment } from 'semantic-ui-react'
import DummyComment from '~/components/DummyComment'
import { map, range } from 'ramda'
import styles from './index.css'

class CommentListPage extends PureComponent {
  static defaultProps = {
    className: '',
  }

  render() {
    const { id, className } = this.props

    return (
      <Container text id={id} className={cx(styles.main, className)}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>{
              map(i => <DummyComment key={i} className={styles.comment} />, range(0, 3))
            }</Grid.Column>
            <Grid.Column width={8}>
              <Comment.Group>
                <Comment>
                  <Comment.Avatar className={styles.avatar} />
                  <Comment.Content>
                    <Comment.Author as="a">推坑人</Comment.Author>
                    <Comment.Metadata>
                      <div>Today at 2:51PM</div>
                    </Comment.Metadata>
                    <Comment.Text>我覺得這個 issue 和坑主昨天在 AdaJS.tw 的問題有關（見下面的貼文）</Comment.Text>
                    <Comment.Actions>
                      <Comment.Action>Reply</Comment.Action>
                    </Comment.Actions>
                  </Comment.Content>
                  <Comment.Group>
                    <Comment>
                      <Comment.Avatar className={styles.avatar} />
                      <Comment.Content>
                        <Comment.Author as="a">推坑人</Comment.Author>
                        <Comment.Metadata>
                          <div>Today at 3:45PM</div>
                        </Comment.Metadata>
                        <Comment.Text>fb 嵌入貼文</Comment.Text>
                        <Comment.Actions>
                          <Comment.Action>Reply</Comment.Action>
                        </Comment.Actions>
                      </Comment.Content>
                    </Comment>
                  </Comment.Group>
                </Comment>

                <Comment>
                  <Comment.Avatar className={styles.avatar} />
                  <Comment.Content>
                    <Comment.Author as="a">沒有人</Comment.Author>
                    <Comment.Metadata>
                      <div>Today at 3:50PM</div>
                    </Comment.Metadata>
                    <Comment.Text>除了 issue 內的討論外，在第 36 次黑客松時，另外一個專案也用到了 CPS transformation ，也許該準備一篇 review ，同時做些常見的 CPS transformation 教學。</Comment.Text>
                    <Comment.Actions>
                      <Comment.Action>Reply</Comment.Action>
                    </Comment.Actions>
                  </Comment.Content>
                </Comment>

                <Comment>
                  <Comment.Avatar className={styles.avatar} />
                  <Comment.Content>
                    <Comment.Author as="a">沒有人</Comment.Author>
                    <Comment.Metadata>
                      <div>Today at 3:52PM</div>
                    </Comment.Metadata>
                    <Comment.Text>好！</Comment.Text>
                    <Comment.Actions>
                      <Comment.Action>Reply</Comment.Action>
                    </Comment.Actions>
                  </Comment.Content>
                </Comment>
              </Comment.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    )
  }
}

export default CommentListPage

