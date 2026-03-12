export type CategorySpotlight = {
  id: string
  name: string
  description: string
  imageLabel: string
  commandHint: string
}

export type ProductSpotlight = {
  id: string
  name: string
  category: string
  price: number
  oldPrice?: number
  rating: number
  sold: number
  tag: string
}

export type BrandSpotlight = {
  id: string
  name: string
  slogan: string
}

export type TrustHighlight = {
  id: string
  title: string
  description: string
  badge: string
}
