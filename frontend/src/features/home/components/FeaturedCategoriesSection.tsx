import type { CategorySpotlight } from '../types'
import SectionHeading from './SectionHeading'

type FeaturedCategoriesSectionProps = {
  items: CategorySpotlight[]
}

function FeaturedCategoriesSection({ items }: FeaturedCategoriesSectionProps) {
  return (
    <section className="home-section">
      <SectionHeading
        eyebrow="Danh mục nổi bật"
        title="Danh mục nổi bật"
        description="Các nhóm sản phẩm được người dùng quan tâm nhiều, phù hợp để bắt đầu tra cứu nhanh."
      />

      <div className="home-category-grid">
        {items.map((category, index) => (
          <article
            key={category.id}
            className="home-category-card reveal-up"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <div className="category-banner">{category.imageLabel}</div>
            <h3>{category.name}</h3>
            <p>{category.description}</p>
            <span>{category.commandHint}</span>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FeaturedCategoriesSection
