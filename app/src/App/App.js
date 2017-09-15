import React, { PureComponent } from 'react';
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import MainPage from '~/components/MainPage'
import AnotherPage from '~/components/AnotherPage'

import './App.css';

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
          <div id={id} className={className}>
            <Menu inverted>
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
                to="/another"
                name="another"
                active={activeItem === 'another'}
                onClick={this.handleClick}
              >
                another
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

            <Route exact path="/" component={MainPage} />
            <Route path="/another" component={AnotherPage} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;

