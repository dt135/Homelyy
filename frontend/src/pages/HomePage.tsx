import BrandsSection from '../features/home/components/BrandsSection'
import CtaSection from '../features/home/components/CtaSection'
import FeaturedCategoriesSection from '../features/home/components/FeaturedCategoriesSection'
import HeroBanner from '../features/home/components/HeroBanner'
import ProductShowcaseSection from '../features/home/components/ProductShowcaseSection'
import TrustHighlightsSection from '../features/home/components/TrustHighlightsSection'
import {
  brands,
  categories,
  featuredProducts,
  newArrivals,
  trustHighlights,
} from '../features/home/data/homeData'
import '../features/home/home.css'

function HomePage() {
  return (
    <section className="home-page">
      <HeroBanner />
      <TrustHighlightsSection items={trustHighlights} />
      <FeaturedCategoriesSection items={categories} />
      <ProductShowcaseSection
        eyebrow="Gợi ý nổi bật"
        title="Sản phẩm nổi bật"
        description="Nhóm sản phẩm được mua nhiều trong tuần này, ưu tiên cho nhu cầu gia đình hiện đại."
        products={featuredProducts}
      />
      <ProductShowcaseSection
        eyebrow="Mới cập nhật"
        title="Sản phẩm mới"
        description="Các mẫu vừa cập nhật với thiết kế tối giản, dễ kết hợp vào không gian sống hiện đại."
        products={newArrivals}
      />
      <BrandsSection items={brands} />
      <CtaSection />
    </section>
  )
}

export default HomePage
