import { useEffect, useState } from 'react'
import BrandsSection from '../features/home/components/BrandsSection'
import CtaSection from '../features/home/components/CtaSection'
import FeaturedCategoriesSection from '../features/home/components/FeaturedCategoriesSection'
import HeroBanner from '../features/home/components/HeroBanner'
import ProductShowcaseSection from '../features/home/components/ProductShowcaseSection'
import TrustHighlightsSection from '../features/home/components/TrustHighlightsSection'
import { getErrorMessage } from '../services/apiClient'
import {
  brands,
  categories,
  trustHighlights,
} from '../features/home/data/homeData'
import { fetchFeaturedProducts, fetchNewProducts } from '../services/productService'
import type { Product } from '../types/product'
import '../features/home/home.css'

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setIsLoading(true)
    setErrorMessage('')

    Promise.all([fetchFeaturedProducts(), fetchNewProducts()])
      .then(([featuredPayload, newPayload]) => {
        setFeaturedProducts(featuredPayload)
        setNewProducts(newPayload)
      })
      .catch((error) => {
        setFeaturedProducts([])
        setNewProducts([])
        setErrorMessage(getErrorMessage(error))
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <section className="home-page">
      <HeroBanner />
      <TrustHighlightsSection items={trustHighlights} />
      <FeaturedCategoriesSection items={categories} />

      {isLoading ? <div className="state-card">Đang tải sản phẩm nổi bật...</div> : null}
      {!isLoading && errorMessage ? <div className="state-card">{errorMessage}</div> : null}

      <ProductShowcaseSection
        eyebrow="Gợi ý nổi bật"
        title="Sản phẩm nổi bật"
        description="Nhóm sản phẩm được mua nhiều trong tuần này, ưu tiên cho nhu cầu gia đình hiện đại."
        products={featuredProducts}
        mode="featured"
      />
      <ProductShowcaseSection
        eyebrow="Mới cập nhật"
        title="Sản phẩm mới"
        description="Các mẫu vừa cập nhật với thiết kế tối giản, dễ kết hợp vào không gian sống hiện đại."
        products={newProducts}
        mode="new"
      />
      <BrandsSection items={brands} />
      <CtaSection />
    </section>
  )
}

export default HomePage
