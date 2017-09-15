import React, { PureComponent } from 'react'
import { Container } from 'semantic-ui-react'
import './index.css'

class AnotherPage extends PureComponent {
  static defaultProps = {
    className: '',
  }

  render() {
    const { id, className } = this.props

    return (
      <Container text id={id} className={className}>
        just another page
      </Container>
    )
  }
}

export default AnotherPage

