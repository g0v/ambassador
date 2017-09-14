import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react'

import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { activeItem: 'home' }
  }

  handleClick = (e, { name }) => {
    this.setState({ activeItem: name })
  }

  render() {
    const { activeItem } = this.state

    return (
      <div className="App">
        <Menu inverted>
          <Menu.Item name="home" active={activeItem === 'home'} onClick={this.handleClick}>YA0H</Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item name="sign-in" active={activeItem === 'sign-in'} onClick={this.handleClick}>Sign In</Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}

export default App;
