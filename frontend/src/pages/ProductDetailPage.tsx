import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { getErrorMessage } from '../services/apiClient'
import { fetchProductById, fetchRelatedProducts } from '../services/productService'
import type { Product } from '../types/product'
import { vndFormatter } from '../utils/formatters'

function ProductDetailPage() {
  const { productId } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!productId) {
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    Promise.all([fetchProductById(productId), fetchRelatedProducts(productId)])
      .then(([productPayload, relatedPayload]) => {
        setProduct(productPayload)
        setRelatedProducts(relatedPayload)
      })
      .catch((error) => {
        setProduct(null)
        setRelatedProducts([])
        setErrorMessage(getErrorMessage(error))
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [productId])

  return (
    <section className="page-stack reveal-up">
      <p className="eyebrow">Chi tiết sản phẩm</p>
      <h1 className="page-title">Chi tiết sản phẩm</h1>

      {isLoading ? <div className="state-card">Đang tải thông tin sản phẩm...</div> : null}
      {!isLoading && errorMessage ? <div className="state-card">{errorMessage}</div> : null}

      {!isLoading && !errorMessage && product ? (
        <>
          <div className="product-detail-card">
            <div className="product-detail-media">{product.thumbnail}</div>
            <div className="product-detail-content">
              <h2>{product.name}</h2>
              <p className="catalog-muted">{product.category}</p>
              <p>{product.description}</p>

              <div className="product-price-group">
                <strong>{vndFormatter.format(product.price)}</strong>
                {product.oldPrice ? <span>{vndFormatter.format(product.oldPrice)}</span> : null}
              </div>

              <div className="product-meta">
                <span>Đánh giá {product.rating}/5</span>
                <span>Tồn kho {product.stock}</span>
                <span>Đã bán {product.sold}</span>
              </div>

              <div className="button-row">
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => addToCart(product.id)}
                >
                  Thêm vào giỏ hàng
                </button>
                <Link to="/products" className="ghost-btn">
                  Quay lại danh sách
                </Link>
              </div>
            </div>
          </div>

          <article className="placeholder-card">
            <h3>Thông số kỹ thuật</h3>
            <div className="spec-grid">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="spec-row">
                  <span>{key}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="placeholder-card">
            <h3>Sản phẩm liên quan</h3>
            {relatedProducts.length === 0 ? (
              <p className="catalog-muted">Chưa có sản phẩm liên quan.</p>
            ) : (
              <div className="related-grid">
                {relatedProducts.map((item) => (
                  <Link key={item.id} to={`/products/${item.id}`} className="related-card">
                    <p>{item.thumbnail}</p>
                    <strong>{item.name}</strong>
                    <span>{vndFormatter.format(item.price)}</span>
                  </Link>
                ))}
              </div>
            )}
          </article>
        </>
      ) : null}
    </section>
  )
}

export default ProductDetailPage
