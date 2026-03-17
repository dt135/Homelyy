import type { BrandSpotlight } from '../types'
import SectionHeading from './SectionHeading'

type BrandsSectionProps = {
  items: BrandSpotlight[]
}

function BrandsSection({ items }: BrandsSectionProps) {
  return (
    <section className="home-section">
      <SectionHeading
        eyebrow="Đối tác chọn lọc"
        title="Thương hiệu đồng hành"
        description="Các đối tác thương hiệu được lựa chọn dựa trên độ bền, mức độ ổn định và hậu mãi."
      />

      <div className="home-brand-grid">
        {items.map((brand, index) => (
          <article
            key={brand.id}
            className="home-brand-card reveal-up"
            style={{ animationDelay: `${index * 65}ms` }}
          >
            <h3>{brand.name}</h3>
            <p>{brand.slogan}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default BrandsSection
