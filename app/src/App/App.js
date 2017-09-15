import React, { PureComponent } from 'react'
import cx from 'classnames'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import MainPage from '~/components/MainPage'
import IssueListPage from '~/components/IssueListPage'
import CommentListPage from '~/components/CommentListPage'
import EditorPage from '~/components/EditorPage'

import styles from './App.css'

class App extends PureComponent {
  static defaultProps = {
    className: '',
  }

  constructor(props) {
    super(props)
    this.state = { activeItem: 'home' }
  }

  handleClick = (e, { name }) => {
    this.setState({ activeItem: name })
  }

  render() {
    const { id, className, store } = this.props
    const { activeItem } = this.state

    return (
      <Provider store={store}>
        <Router>
          <div id={id} className={cx(styles.main, className)}>
            <Menu inverted fixed="top" className={styles.menu}>
              <Menu.Item
                as={Link}
                to="/"
                name="home"
                active={activeItem === 'home'}
                onClick={this.handleClick}
              >
                YA0H
              </Menu.Item>
              <Menu.Item
                as={Link}
                to="/issues"
                name="issues"
                active={activeItem === 'issues'}
                onClick={this.handleClick}
              >
                Issues
              </Menu.Item>
              <Menu.Item
                as={Link}
                to="/comments"
                name="comments"
                active={activeItem === 'comments'}
                onClick={this.handleClick}
              >
                Comments
              </Menu.Item>
              <Menu.Item
                as={Link}
                to="/editor"
                name="editor"
                active={activeItem === 'editor'}
                onClick={this.handleClick}
              >
                Editor
              </Menu.Item>
              <Menu.Menu position="right">
                <Menu.Item
                  name="sign-in"
                  active={activeItem === 'sign-in'}
                  onClick={this.handleClick}
                >
                  Sign In
                </Menu.Item>
              </Menu.Menu>
            </Menu>

            <div className={styles.container}>
              <Route exact path="/" component={MainPage} />
              <Route path="/issues" component={IssueListPage} />
              <Route path="/comments" component={CommentListPage} />
              <Route path="/editor" component={EditorPage} />
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;

