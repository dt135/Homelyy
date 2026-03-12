import { Link } from 'react-router-dom'
import { useCart } from '../../../hooks/useCart'
import type { Product } from '../../../types/product'
import { isLikelyImageUrl } from '../../../utils/images'
import { vndFormatter } from '../../../utils/formatters'

type ProductCardProps = {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  return (
    <article className="catalog-product-card reveal-up">
      <div className="catalog-product-thumb">
        {isLikelyImageUrl(product.thumbnail) ? (
          <img src={product.thumbnail} alt={product.name} className="catalog-product-thumb-image" />
        ) : (
          product.thumbnail
        )}
      </div>
      <p className="tag">{product.brand}</p>
      <h3>{product.name}</h3>
      <p className="catalog-muted">{product.category}</p>

      <div className="product-price-group">
        <strong>{vndFormatter.format(product.price)}</strong>
        {product.oldPrice ? <span>{vndFormatter.format(product.oldPrice)}</span> : null}
      </div>

      <div className="product-meta">
        <span>Đánh giá {product.rating}/5</span>
        <span>Tồn kho {product.stock}</span>
      </div>

      <div className="button-row">
        <button type="button" className="primary-btn" onClick={() => addToCart(product.id)}>
          Thêm vào giỏ
        </button>
        <Link to={`/products/${product.id}`} className="ghost-btn">
          Chi tiết
        </Link>
      </div>
    </article>
  )
}

export default ProductCard
