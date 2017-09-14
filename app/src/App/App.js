import React, { PureComponent } from 'react';
import { Provider } from 'react-redux'
import { Menu } from 'semantic-ui-react'
import Main from '~/components/Main'

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
    const { store } = this.props
    const { activeItem } = this.state

    return (
      <Provider store={store}>
        <div className="App">
          <Menu inverted>
            <Menu.Item name="home" active={activeItem === 'home'} onClick={this.handleClick}>YA0H</Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item name="sign-in" active={activeItem === 'sign-in'} onClick={this.handleClick}>Sign In</Menu.Item>
            </Menu.Menu>
          </Menu>
          <Main />
        </div>
      </Provider>
    );
  }
}

export default App;

