import type { Product } from '../../../types/product'
import ProductCard from './ProductCard'

type ProductGridProps = {
  items: Product[]
}

function ProductGrid({ items }: ProductGridProps) {
  return (
    <div className="catalog-product-grid">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid
