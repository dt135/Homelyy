import { env } from '../config/env'
import { API_ENDPOINTS } from '../constants/endpoints'
import { mockRequest } from './apiClient'
import { request } from './httpClient'
import { brandOptions, categoryOptions } from './mock/data/categories'
import { mockProducts } from './mock/data/products'
import type { Product, ProductQuery } from '../types/product'

function sortProducts(products: Product[], sort: ProductQuery['sort']): Product[] {
  const cloned = [...products]

  switch (sort) {
    case 'price-asc':
      return cloned.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return cloned.sort((a, b) => b.price - a.price)
    case 'newest':
      return cloned.sort((a, b) => Number(b.isNew) - Number(a.isNew))
    case 'popular':
    default:
      return cloned.sort((a, b) => b.sold - a.sold)
  }
}

export async function fetchProducts(query: ProductQuery = {}): Promise<Product[]> {
  if (!env.useMockApi) {
    const params = new URLSearchParams()
    if (query.search) {
      params.set('search', query.search)
    }
    if (query.category) {
      params.set('category', query.category)
    }
    if (query.brand) {
      params.set('brand', query.brand)
    }
    const queryString = params.toString()
    return request<Product[]>(`${API_ENDPOINTS.products.list}${queryString ? `?${queryString}` : ''}`)
  }

  return mockRequest({
    handler: () => {
      const normalizedSearch = query.search?.trim().toLowerCase() ?? ''

      const filtered = mockProducts.filter((product) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          product.name.toLowerCase().includes(normalizedSearch) ||
          product.description.toLowerCase().includes(normalizedSearch)

        const matchesCategory = !query.category || product.category === query.category
        const matchesBrand = !query.brand || product.brand === query.brand
        const matchesMinPrice = query.minPrice == null || product.price >= query.minPrice
        const matchesMaxPrice = query.maxPrice == null || product.price <= query.maxPrice

        return (
          matchesSearch &&
          matchesCategory &&
          matchesBrand &&
          matchesMinPrice &&
          matchesMaxPrice
        )
      })

      return sortProducts(filtered, query.sort)
    },
  })
}

export async function fetchProductById(productId: string): Promise<Product> {
  if (!env.useMockApi) {
    return request<Product>(API_ENDPOINTS.products.detail.replace(':id', productId))
  }

  return mockRequest({
    handler: () => {
      const found = mockProducts.find((product) => product.id === productId)
      if (!found) {
        throw new Error('Product not found')
      }
      return found
    },
  })
}

export async function fetchRelatedProducts(productId: string): Promise<Product[]> {
  if (!env.useMockApi) {
    const current = await fetchProductById(productId)
    const allProducts = await fetchProducts()
    return allProducts.filter((item) => item.id !== current.id && item.category === current.category).slice(0, 4)
  }

  const product = mockProducts.find((item) => item.id === productId)
  if (!product) {
    return []
  }

  return mockRequest({
    handler: () =>
      mockProducts
        .filter((item) => item.id !== productId && item.category === product.category)
        .slice(0, 4),
  })
}

export async function fetchCatalogFilters(): Promise<{
  categories: string[]
  brands: string[]
}> {
  if (!env.useMockApi) {
    const categoryPayload = await request<Array<{ id: string; name: string }>>(API_ENDPOINTS.categories.list)
    return {
      categories: categoryPayload.map((item) => item.name),
      brands: [],
    }
  }

  return mockRequest({
    handler: () => ({ categories: categoryOptions, brands: brandOptions }),
  })
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  return mockRequest({
    handler: () => mockProducts.filter((product) => product.isFeatured),
  })
}

export async function fetchNewProducts(): Promise<Product[]> {
  return mockRequest({
    handler: () => mockProducts.filter((product) => product.isNew),
  })
}
