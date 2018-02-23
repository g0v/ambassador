import React, { PureComponent } from 'react'
import cx from 'classnames'
import { List } from 'semantic-ui-react'
import ProductListItem from '~/components/ProductListItem'
import { map } from 'ramda'
import styles from './index.css'

class ProductList extends PureComponent {
  static defaultProps = {
    className: '',
    products: []
  }

  render() {
    const { id, className, products } = this.props

    return (
      <List id={id} className={cx(styles.main, className)}>{
        map(
          p => typeof p === 'string'
            ? <List.Item key={p} content={p} />
            : <ProductListItem key={p.url} data={p} />,
          products
        )
      }</List>
    )
  }
}

export default ProductList
