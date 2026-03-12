import { Link } from 'react-router-dom'
import type { ProductSpotlight } from '../types'
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
  products: ProductSpotlight[]
}

function ProductShowcaseSection({
  eyebrow,
  title,
  description,
  products,
}: ProductShowcaseSectionProps) {
  return (
    <section className="home-section">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />

      <div className="home-product-grid">
        {products.map((product, index) => (
          <article
            key={product.id}
            className="home-product-card reveal-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <p className="product-tag">{product.tag}</p>
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
    </section>
  )
}

export default ProductShowcaseSection
