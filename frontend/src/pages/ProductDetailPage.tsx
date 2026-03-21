import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { getErrorMessage } from '../services/apiClient'
import { fetchProductById, fetchRelatedProducts } from '../services/productService'
import type { Product, ProductMedia } from '../types/product'
import { isLikelyImageUrl } from '../utils/images'
import { vndFormatter } from '../utils/formatters'
import { formatRemainingStock, getStockStatus } from '../utils/stock'

function ProductDetailPage() {
  const { productId } = useParams()
  const { isAuthenticated, user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)

  const galleryMedia = useMemo<ProductMedia[]>(() => {
    if (!product) {
      return []
    }

    if (Array.isArray(product.media) && product.media.length > 0) {
      return [...product.media]
        .map((item, index) => ({
          ...item,
          url: String(item.url || '').trim(),
          position: Number.isFinite(Number(item.position)) ? Number(item.position) : index,
          alt: String(item.alt || product.name || '').trim(),
          isPrimary: Boolean(item.isPrimary),
        }))
        .filter((item) => item.url)
        .sort((a, b) => Number(a.position || 0) - Number(b.position || 0))
    }

    const mergedImages = [product.thumbnail, ...(product.images ?? [])]
      .map((item) => item.trim())
      .filter(Boolean)

    const uniqueImages = [...new Set(mergedImages)]

    return uniqueImages.map((url, index) => ({
      url,
      position: index,
      alt: product.name,
      isPrimary: index === 0,
    }))
  }, [product])

  const defaultMediaIndex = useMemo(() => {
    const primaryIndex = galleryMedia.findIndex((item) => item.isPrimary)
    return primaryIndex >= 0 ? primaryIndex : 0
  }, [galleryMedia])

  const displayedMedia = galleryMedia[activeMediaIndex] || galleryMedia[defaultMediaIndex]
  const displayedImage = displayedMedia?.url || product?.thumbnail || ''
  const stockStatus = getStockStatus(product?.stock ?? 0)
  const isAdminUser = user?.role === 'admin'
  const canAddToCart = stockStatus.canPurchase && !isAdminUser
  const specEntries = useMemo(
    () => Object.entries(product?.specs ?? {}).filter(([key]) => key !== 'Äang cáº­p nháº­t'),
    [product],
  )
  const technicalDetails = useMemo(
    () => String(product?.technicalDetails || '').trim(),
    [product],
  )

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

  useEffect(() => {
    setActiveMediaIndex(defaultMediaIndex)
  }, [defaultMediaIndex])

  function handleAddToCart() {
    if (!product) {
      return
    }

    if (isAdminUser) {
      navigate('/admin')
      return
    }

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
    <section className="page-stack reveal-up">
      <p className="eyebrow">Chi tiết sản phẩm</p>
      <h1 className="page-title">Chi tiết sản phẩm</h1>

      {isLoading ? <div className="state-card">Đang tải thông tin sản phẩm...</div> : null}
      {!isLoading && errorMessage ? <div className="state-card">{errorMessage}</div> : null}

      {!isLoading && !errorMessage && product ? (
        <>
          <div className="product-detail-card">
            <div className="product-detail-media-column">
              <div className="product-detail-media">
                {isLikelyImageUrl(displayedImage) ? (
                  <img
                    src={displayedImage}
                    alt={displayedMedia?.alt || product.name}
                    className="product-detail-media-image"
                  />
                ) : (
                  displayedImage
                )}
              </div>

              {galleryMedia.length > 1 ? (
                <div className="product-gallery-grid">
                  {galleryMedia.map((item, index) => {
                    const isActive = index === activeMediaIndex

                    return (
                      <button
                        key={`${item.url}-${index}`}
                        type="button"
                        className={`product-gallery-item ${isActive ? 'is-active' : ''}`}
                        onClick={() => setActiveMediaIndex(index)}
                        onMouseEnter={() => setActiveMediaIndex(index)}
                        onFocus={() => setActiveMediaIndex(index)}
                        aria-label={`Xem ảnh ${index + 1}`}
                      >
                        {isLikelyImageUrl(item.url) ? (
                          <img
                            src={item.url}
                            alt={item.alt || `Ảnh ${index + 1} của ${product.name}`}
                            className="product-gallery-image"
                          />
                        ) : (
                          <span className="product-gallery-fallback">Ảnh {index + 1}</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              ) : null}
            </div>
            <div className="product-detail-content">
              <h2>{product.name}</h2>
              <p className="catalog-muted">{product.category}</p>

              <div className="product-price-group">
                <strong>{vndFormatter.format(product.price)}</strong>
                {product.oldPrice ? <span>{vndFormatter.format(product.oldPrice)}</span> : null}
              </div>

              <div className="product-meta">
                <span>Đánh giá {product.rating}/5</span>
                <span>{formatRemainingStock(product.stock)}</span>
                <span>Đã bán {product.sold}</span>
              </div>

              {stockStatus.label ? (
                <div className={`stock-badge stock-badge-${stockStatus.tone}`}>{stockStatus.label}</div>
              ) : null}

              <div className="button-row">
                <button
                  type="button"
                  className="primary-btn"
                  onClick={handleAddToCart}
                  disabled={!canAddToCart}
                >
                  {!stockStatus.canPurchase ? 'Hết hàng' : isAdminUser ? 'Dành cho khách hàng' : 'Thêm vào giỏ hàng'}
                </button>
                <Link to="/products" className="ghost-btn">
                  Quay lại danh sách
                </Link>
              </div>

              <p className="catalog-muted">
                <strong>Mô tả:</strong>{' '}
                {product.description?.trim()
                  ? product.description
                  : 'Đang cập nhật mô tả chi tiết cho sản phẩm này.'}
              </p>

              <p className="catalog-muted">
                <strong>Thông số kỹ thuật:</strong>{' '}
                {specEntries.length > 0
                  ? specEntries.map(([key, value]) => `${key}: ${value}`).join(' • ')
                  : technicalDetails || 'Đang cập nhật thông số kỹ thuật.'}
              </p>
            </div>
          </div>

          <article className="placeholder-card">
            <h3>Sản phẩm liên quan</h3>
            {relatedProducts.length === 0 ? (
              <p className="catalog-muted">Chưa có sản phẩm liên quan.</p>
            ) : (
              <div className="related-grid">
                {relatedProducts.map((item) => (
                  <Link key={item.id} to={`/products/${item.id}`} className="related-card">
                    {isLikelyImageUrl(item.thumbnail) ? (
                      <img src={item.thumbnail} alt={item.name} className="related-card-image" />
                    ) : (
                      <p>{item.thumbnail}</p>
                    )}
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
