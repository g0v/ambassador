import React, { PureComponent } from 'react'
import cx from 'classnames'
import { Button } from 'semantic-ui-react'
import styles from './index.css'

class Pagenator extends PureComponent {
  static defaultProps = {
    className: '',
    page: 0,
    total: 0
  }

  render() {
    const { id, className, page, total, onChange } = this.props

    return (
      <Button.Group id={id} className={cx(styles.main, className)}>
        <Button
          icon="triangle left"
          disabled={page === 0}
          onClick={() => onChange && onChange(0)}
        />
        {
          total > 1 &&
            <Button
              active={page === 0}
              onClick={() => onChange && onChange(0)}
            >
              1
            </Button>
        }
        {
          total > 2
            ? (page === 0 || page === 1 || page === 2)
                ? <Button active={page === 1} onClick={() => onChange && onChange(1)}>2</Button>
                : <Button disabled>&#8230;</Button>
            : null
        }
        {
          total > 3
            ? (page === 0 || page === 1)
                ? <Button onClick={() => onChange && onChange(2)}>3</Button>
                : (page === (total - 2) || page === (total - 1))
                    ? <Button onClick={() => onChange && onChange(total - 3)}>{ total - 2 }</Button>
                    : <Button active>{ page + 1 }</Button>
            : null
        }
        {
          total > 4
            ? (page === (total - 3) || page === (total - 2) || page === (total - 1))
                ? <Button active={page === (total - 2)} onClick={() => onChange && onChange(total - 2)}>
                    { total -1 }
                  </Button>
                : <Button disabled>&#8230;</Button>
            : null
        }
        {
          total > 5 &&
            <Button active={page === (total - 1)} onClick={() => onChange && onChange(total - 1)}>
              { total }
            </Button>
        }
        <Button
          icon="triangle right"
          disabled={page >= (total - 1)}
          onClick={() => onChange && onChange(page + 1)}
        />
      </Button.Group>
    )
  }
}

export default Pagenator
