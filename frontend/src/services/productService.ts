import { env } from '../config/env'
import { API_ENDPOINTS } from '../constants/endpoints'
import { mockRequest } from './apiClient'
import { request } from './httpClient'
import { brandOptions, categoryOptions } from './mock/data/categories'
import { mockProducts } from './mock/data/products'
import type { Product, ProductQuery } from '../types/product'

function normalizeProduct(product: Partial<Product>): Product {
  return {
    id: product.id ?? '',
    slug: product.slug ?? product.id ?? '',
    name: product.name ?? 'Sản phẩm',
    description: product.description ?? 'Đang cập nhật mô tả sản phẩm.',
    category: product.category ?? 'Khác',
    brand: product.brand ?? 'Homelyy',
    price: Number(product.price ?? 0),
    oldPrice: product.oldPrice,
    rating: Number(product.rating ?? 0),
    stock: Number(product.stock ?? 0),
    sold: Number(product.sold ?? 0),
    thumbnail: product.thumbnail ?? (product.name || 'Sản phẩm').toUpperCase(),
    images: Array.isArray(product.images) ? product.images : [],
    specs:
      product.specs && typeof product.specs === 'object'
        ? product.specs
        : {
            'Đang cập nhật': 'Thông tin kỹ thuật sẽ hiển thị sớm.',
          },
    isFeatured: Boolean(product.isFeatured),
    isNew: Boolean(product.isNew),
  }
}

function normalizeProducts(products: Partial<Product>[]): Product[] {
  return products.map((product) => normalizeProduct(product))
}

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
    if (query.minPrice != null) {
      params.set('minPrice', String(query.minPrice))
    }
    if (query.maxPrice != null) {
      params.set('maxPrice', String(query.maxPrice))
    }
    if (query.sort) {
      params.set('sort', query.sort)
    }
    const queryString = params.toString()
    const payload = await request<Partial<Product>[]>(
      `${API_ENDPOINTS.products.list}${queryString ? `?${queryString}` : ''}`,
    )
    return normalizeProducts(payload)
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

      return normalizeProducts(sortProducts(filtered, query.sort))
    },
  })
}

export async function fetchProductById(productId: string): Promise<Product> {
  if (!env.useMockApi) {
    const payload = await request<Partial<Product>>(API_ENDPOINTS.products.detail.replace(':id', productId))
    return normalizeProduct(payload)
  }

  return mockRequest({
    handler: () => {
      const found = mockProducts.find((product) => product.id === productId)
      if (!found) {
        throw new Error('Product not found')
      }
      return normalizeProduct(found)
    },
  })
}

export async function fetchRelatedProducts(productId: string): Promise<Product[]> {
  if (!env.useMockApi) {
    const current = await fetchProductById(productId)
    const allProducts = await fetchProducts({ category: current.category, sort: 'popular' })
    return allProducts.filter((item) => item.id !== current.id).slice(0, 4)
  }

  const product = mockProducts.find((item) => item.id === productId)
  if (!product) {
    return []
  }

  return mockRequest({
    handler: () =>
      normalizeProducts(
        mockProducts
          .filter((item) => item.id !== productId && item.category === product.category)
          .slice(0, 4),
      ),
  })
}

export async function fetchCatalogFilters(): Promise<{
  categories: string[]
  brands: string[]
}> {
  if (!env.useMockApi) {
    const [categoryPayload, productsPayload] = await Promise.all([
      request<Array<{ id: string; name: string }>>(API_ENDPOINTS.categories.list),
      request<Array<{ brand: string }>>(`${API_ENDPOINTS.products.list}?limit=200`),
    ])

    const brandSet = new Set(
      productsPayload.map((item) => item.brand).filter((brand): brand is string => Boolean(brand)),
    )

    return {
      categories: categoryPayload.map((item) => item.name),
      brands: [...brandSet].sort((a, b) => a.localeCompare(b, 'vi')),
    }
  }

  return mockRequest({
    handler: () => ({ categories: categoryOptions, brands: brandOptions }),
  })
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  if (!env.useMockApi) {
    const payload = await request<Partial<Product>[]>(`${API_ENDPOINTS.products.list}?featured=true&sort=popular&limit=4`)
    return normalizeProducts(payload)
  }

  return mockRequest({
    handler: () => normalizeProducts(mockProducts.filter((product) => product.isFeatured)),
  })
}

export async function fetchNewProducts(): Promise<Product[]> {
  if (!env.useMockApi) {
    const payload = await request<Partial<Product>[]>(`${API_ENDPOINTS.products.list}?new=true&sort=newest&limit=4`)
    return normalizeProducts(payload)
  }

  return mockRequest({
    handler: () => normalizeProducts(mockProducts.filter((product) => product.isNew)),
  })
}
