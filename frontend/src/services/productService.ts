import { API_ENDPOINTS } from '../constants/endpoints'
import { request } from './httpClient'
import type { Product, ProductMedia, ProductQuery } from '../types/product'

type NormalizedMediaItem = {
  url: string
  publicId: string
  alt: string
  position: number
  isPrimary: boolean
}

function normalizeMedia(input: unknown, fallbackAlt: string): ProductMedia[] {
  if (!Array.isArray(input)) {
    return []
  }

  const normalized: NormalizedMediaItem[] = input
    .map((item, index) => {
      if (!item || typeof item !== 'object') {
        return null
      }

      const entry = item as ProductMedia
      const url = String(entry.url || '').trim()
      if (!url) {
        return null
      }

      const positionValue = Number(entry.position)

      return {
        url,
        publicId: String(entry.publicId || '').trim(),
        alt: String(entry.alt || fallbackAlt).trim(),
        position: Number.isFinite(positionValue) && positionValue >= 0 ? positionValue : index,
        isPrimary: Boolean(entry.isPrimary),
      }
    })
    .filter((item): item is NormalizedMediaItem => item !== null)
    .sort((a, b) => Number(a.position || 0) - Number(b.position || 0))

  if (normalized.length === 0) {
    return []
  }

  const deduped: NormalizedMediaItem[] = []
  const byUrl = new Map<string, NormalizedMediaItem>()

  normalized.forEach((item) => {
    const existing = byUrl.get(item.url)
    if (existing) {
      if (!existing.publicId && item.publicId) {
        existing.publicId = item.publicId
      }
      if (!existing.alt && item.alt) {
        existing.alt = item.alt
      }
      if (item.isPrimary) {
        existing.isPrimary = true
      }
      return
    }

    const cloned = { ...item }
    byUrl.set(cloned.url, cloned)
    deduped.push(cloned)
  })

  const primaryIndex = deduped.findIndex((item) => item.isPrimary)
  const resolvedPrimaryIndex = primaryIndex >= 0 ? primaryIndex : 0

  return deduped.map((item, index) => ({
    ...item,
    position: index,
    isPrimary: index === resolvedPrimaryIndex,
  }))
}

function buildLegacyMedia(product: Partial<Product>, fallbackAlt: string): ProductMedia[] {
  const thumbnail = String(product.thumbnail || '').trim()
  const images = Array.isArray(product.images) ? product.images : []
  const imagePublicIds = Array.isArray(product.imagePublicIds) ? product.imagePublicIds : []

  const media: ProductMedia[] = []

  if (thumbnail) {
    media.push({
      url: thumbnail,
      publicId: String(product.thumbnailPublicId || '').trim(),
      alt: fallbackAlt,
      position: 0,
      isPrimary: true,
    })
  }

  images.forEach((url, index) => {
    const normalizedUrl = String(url || '').trim()
    if (!normalizedUrl) {
      return
    }

    media.push({
      url: normalizedUrl,
      publicId: String(imagePublicIds[index] || '').trim(),
      alt: fallbackAlt,
      position: media.length,
      isPrimary: false,
    })
  })

  return normalizeMedia(media, fallbackAlt)
}

function resolveProductMedia(product: Partial<Product>): ProductMedia[] {
  const fallbackAlt = String(product.name || 'Sản phẩm').trim()
  const fromMedia = normalizeMedia(product.media, fallbackAlt)
  if (fromMedia.length > 0) {
    return fromMedia
  }
  return buildLegacyMedia(product, fallbackAlt)
}

function normalizeProduct(product: Partial<Product>): Product {
  const media = resolveProductMedia(product)
  const primaryMedia = media.find((item) => item.isPrimary) || media[0]
  const galleryMedia = media.filter((item) => item.url !== primaryMedia?.url)

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
    thumbnail: primaryMedia?.url || product.thumbnail || (product.name || 'Sản phẩm').toUpperCase(),
    thumbnailPublicId: primaryMedia?.publicId || product.thumbnailPublicId,
    media,
    images: galleryMedia.map((item) => item.url),
    imagePublicIds: galleryMedia.map((item) => item.publicId || '').filter(Boolean),
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

export async function fetchProducts(query: ProductQuery = {}): Promise<Product[]> {
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

export async function fetchProductById(productId: string): Promise<Product> {
  const payload = await request<Partial<Product>>(API_ENDPOINTS.products.detail.replace(':id', productId))
  return normalizeProduct(payload)
}

export async function fetchRelatedProducts(productId: string): Promise<Product[]> {
  const current = await fetchProductById(productId)
  const allProducts = await fetchProducts({ category: current.category, sort: 'popular' })
  return allProducts.filter((item) => item.id !== current.id).slice(0, 4)
}

export async function fetchCatalogFilters(): Promise<{
  categories: string[]
  brands: string[]
}> {
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

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const payload = await request<Partial<Product>[]>(
    `${API_ENDPOINTS.products.list}?featured=true&sort=popular&limit=4`,
  )
  return normalizeProducts(payload)
}

export async function fetchNewProducts(): Promise<Product[]> {
  const payload = await request<Partial<Product>[]>(
    `${API_ENDPOINTS.products.list}?new=true&sort=newest&limit=4`,
  )
  return normalizeProducts(payload)
}
