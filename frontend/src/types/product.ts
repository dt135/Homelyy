export type ProductMedia = {
  url: string
  publicId?: string
  alt?: string
  position?: number
  isPrimary?: boolean
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string
  category: string
  brand: string
  price: number
  oldPrice?: number
  rating: number
  stock: number
  sold: number
  thumbnail: string
  thumbnailPublicId?: string
  media?: ProductMedia[]
  images: string[]
  imagePublicIds?: string[]
  specs: Record<string, string>
  technicalDetails?: string
  isFeatured?: boolean
  isNew?: boolean
}

export type ProductQuery = {
  search?: string
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  sort?: 'popular' | 'newest' | 'price-asc' | 'price-desc'
}
