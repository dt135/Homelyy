import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterSidebar from '../features/products/components/FilterSidebar'
import ProductGrid from '../features/products/components/ProductGrid'
import SearchBar from '../features/products/components/SearchBar'
import SortDropdown from '../features/products/components/SortDropdown'
import { fetchCatalogFilters, fetchProducts } from '../services/productService'
import type { Product } from '../types/product'
import { getErrorMessage } from '../services/apiClient'
import { useDebounce } from '../hooks/useDebounce'

function asNumber(value: string): number | undefined {
  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }
  const parsedValue = Number(trimmed)
  return Number.isFinite(parsedValue) ? parsedValue : undefined
}

function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') ?? '')
  const [category, setCategory] = useState(searchParams.get('category') ?? '')
  const [brand, setBrand] = useState(searchParams.get('brand') ?? '')
  const [minPrice, setMinPrice] = useState(searchParams.get('min') ?? '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max') ?? '')
  const [sort, setSort] = useState<
    'popular' | 'newest' | 'price-asc' | 'price-desc'
  >((searchParams.get('sort') as 'popular' | 'newest' | 'price-asc' | 'price-desc') ?? 'popular')

  const debouncedSearchTerm = useDebounce(searchTerm)

  useEffect(() => {
    setSearchTerm(searchParams.get('q') ?? '')
    setCategory(searchParams.get('category') ?? '')
    setBrand(searchParams.get('brand') ?? '')
    setMinPrice(searchParams.get('min') ?? '')
    setMaxPrice(searchParams.get('max') ?? '')
    setSort(
      (searchParams.get('sort') as 'popular' | 'newest' | 'price-asc' | 'price-desc') ??
        'popular',
    )
  }, [searchParams])

  useEffect(() => {
    const nextParams = new URLSearchParams()
    if (debouncedSearchTerm.trim()) {
      nextParams.set('q', debouncedSearchTerm.trim())
    }
    if (category) {
      nextParams.set('category', category)
    }
    if (brand) {
      nextParams.set('brand', brand)
    }
    if (minPrice.trim()) {
      nextParams.set('min', minPrice.trim())
    }
    if (maxPrice.trim()) {
      nextParams.set('max', maxPrice.trim())
    }
    if (sort !== 'popular') {
      nextParams.set('sort', sort)
    }

    setSearchParams(nextParams, { replace: true })
  }, [debouncedSearchTerm, category, brand, minPrice, maxPrice, sort, setSearchParams])

  useEffect(() => {
    fetchCatalogFilters()
      .then((payload) => {
        setCategories(payload.categories)
        setBrands(payload.brands)
      })
      .catch(() => {
        setCategories([])
        setBrands([])
      })
  }, [])

  const query = useMemo(
    () => ({
      search: debouncedSearchTerm,
      category,
      brand,
      minPrice: asNumber(minPrice),
      maxPrice: asNumber(maxPrice),
      sort,
    }),
    [debouncedSearchTerm, category, brand, minPrice, maxPrice, sort],
  )

  useEffect(() => {
    setIsLoading(true)
    setErrorMessage('')

    fetchProducts(query)
      .then((payload) => {
        setProducts(payload)
      })
      .catch((error) => {
        setProducts([])
        setErrorMessage(getErrorMessage(error))
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [query])

  function resetFilters() {
    setSearchTerm('')
    setCategory('')
    setBrand('')
    setMinPrice('')
    setMaxPrice('')
    setSort('popular')
  }

  return (
    <section className="page-stack catalog-layout">
      <div className="page-head reveal-up">
        <p className="eyebrow">Danh mục sản phẩm</p>
        <h1 className="page-title">Danh sách sản phẩm</h1>
      </div>

      <div className="catalog-toolbar">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <SortDropdown value={sort} onChange={setSort} />
      </div>

      <div className="catalog-content">
        <FilterSidebar
          categories={categories}
          brands={brands}
          selectedCategory={category}
          selectedBrand={brand}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onCategoryChange={setCategory}
          onBrandChange={setBrand}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          onReset={resetFilters}
        />

        <div>
          {isLoading ? <div className="state-card">Đang tải danh sách sản phẩm...</div> : null}
          {!isLoading && errorMessage ? <div className="state-card">{errorMessage}</div> : null}
          {!isLoading && !errorMessage && products.length === 0 ? (
            <div className="state-card">Không tìm thấy sản phẩm phù hợp bộ lọc.</div>
          ) : null}
          {!isLoading && !errorMessage && products.length > 0 ? (
            <ProductGrid items={products} />
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default ProductListPage
