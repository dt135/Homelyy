import { useEffect, useState } from 'react'
import CtaSection from '../features/home/components/CtaSection'
import HeroBanner from '../features/home/components/HeroBanner'
import ProductShowcaseSection from '../features/home/components/ProductShowcaseSection'
import TrustHighlightsSection from '../features/home/components/TrustHighlightsSection'
import { trustHighlights } from '../features/home/data/homeData'
import { getErrorMessage } from '../services/apiClient'
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

      {isLoading ? <div className="state-card">Đang tải sản phẩm nổi bật...</div> : null}
      {!isLoading && errorMessage ? <div className="state-card">{errorMessage}</div> : null}

      <ProductShowcaseSection
        eyebrow="Bán chạy tuần này"
        title="Sản phẩm nổi bật"
        description="Nhóm sản phẩm được mua nhiều trong tuần này, ưu tiên cho nhu cầu gia đình hiện đại."
        products={featuredProducts}
        mode="featured"
      />
      <ProductShowcaseSection
        eyebrow="Vừa lên kệ"
        title="Mẫu mới về"
        description="Các mẫu vừa cập nhật với thiết kế tối giản, dễ kết hợp vào không gian sống hiện đại."
        products={newProducts}
        mode="new"
      />
      <CtaSection />
    </section>
  )
}

export default HomePage
