import { Link } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { useCart } from '../../../hooks/useCart'
import type { Product } from '../../../types/product'
import { isLikelyImageUrl } from '../../../utils/images'
import { vndFormatter } from '../../../utils/formatters'
import { formatRemainingStock, getStockStatus } from '../../../utils/stock'

type ProductCardProps = {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const stockStatus = getStockStatus(product.stock)

  function handleAddToCart() {
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: `${location.pathname}${location.search}`,
        },
      })
      return
    }

    addToCart(product.id, 1, product.stock)
  }

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
        <span>{formatRemainingStock(product.stock)}</span>
      </div>

      {stockStatus.label ? (
        <div className={`stock-badge stock-badge-${stockStatus.tone}`}>{stockStatus.label}</div>
      ) : null}

      <div className="button-row">
        <button
          type="button"
          className="primary-btn"
          onClick={handleAddToCart}
          disabled={!stockStatus.canPurchase}
        >
          {stockStatus.canPurchase ? 'Thêm vào giỏ' : 'Hết hàng'}
        </button>
        <Link to={`/products/${product.id}`} className="ghost-btn">
          Chi tiết
        </Link>
      </div>
    </article>
  )
}

export default ProductCard
