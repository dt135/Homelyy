import { Link } from 'react-router-dom'
import type { Product } from '../../../types/product'
import SectionHeading from './SectionHeading'

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

type ProductShowcaseSectionProps = {
  eyebrow: string
  title: string
  description: string
  products: Product[]
  mode: 'featured' | 'new'
}

function getProductTag(product: Product, mode: 'featured' | 'new', index: number): string {
  if (mode === 'new') {
    return index === 0 ? 'Mới nhất' : 'Mới'
  }

  if (product.rating >= 4.8) {
    return 'Top Rated'
  }
  if (product.sold >= 200) {
    return 'Best Seller'
  }
  return 'Nổi bật'
}

function ProductShowcaseSection({
  eyebrow,
  title,
  description,
  products,
  mode,
}: ProductShowcaseSectionProps) {
  return (
    <section className="home-section">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />

      {products.length === 0 ? (
        <div className="state-card">Hiện chưa có sản phẩm để hiển thị.</div>
      ) : (
        <div className="home-product-grid">
          {products.map((product, index) => (
            <article
              key={product.id}
              className="home-product-card reveal-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <p className="product-tag">{getProductTag(product, mode, index)}</p>
              <h3>{product.name}</h3>
              <p className="product-category">{product.category}</p>

              <div className="product-price-group">
                <strong>{currencyFormatter.format(product.price)}</strong>
                {product.oldPrice ? <span>{currencyFormatter.format(product.oldPrice)}</span> : null}
              </div>

              <div className="product-meta">
                <span>Đánh giá {product.rating}/5</span>
                <span>Đã bán {product.sold}</span>
              </div>

              <Link to={`/products/${product.id}`} className="inline-link">
                Xem chi tiết
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default ProductShowcaseSection
