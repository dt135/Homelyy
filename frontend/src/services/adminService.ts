import { API_ENDPOINTS } from '../constants/endpoints'
import type { Order } from '../types/order'
import type { Product } from '../types/product'
import { request } from './httpClient'

export type AdminCategory = {
  id: string
  name: string
}

export type AdminCategoryPayload = {
  id?: string
  name: string
}

export type AdminProductPayload = {
  id?: string
  slug?: string
  name: string
  description: string
  category: string
  brand: string
  price: number
  oldPrice?: number | null
  rating?: number
  stock: number
  sold?: number
  thumbnail: string
  images?: string[]
  specs?: Record<string, string>
  isFeatured?: boolean
  isNew?: boolean
}

export async function fetchAdminCategories(): Promise<AdminCategory[]> {
  return request<AdminCategory[]>(API_ENDPOINTS.admin.categories)
}

export async function createAdminCategory(payload: AdminCategoryPayload): Promise<AdminCategory> {
  return request<AdminCategory>(API_ENDPOINTS.admin.categories, {
    method: 'POST',
    body: payload,
  })
}

export async function updateAdminCategory(
  categoryId: string,
  payload: Pick<AdminCategoryPayload, 'name'>,
): Promise<AdminCategory> {
  return request<AdminCategory>(API_ENDPOINTS.admin.categoryDetail.replace(':id', categoryId), {
    method: 'PATCH',
    body: payload,
  })
}

export async function deleteAdminCategory(categoryId: string): Promise<AdminCategory> {
  return request<AdminCategory>(API_ENDPOINTS.admin.categoryDetail.replace(':id', categoryId), {
    method: 'DELETE',
  })
}

export async function fetchAdminProducts(): Promise<Product[]> {
  return request<Product[]>(API_ENDPOINTS.admin.products)
}

export async function createAdminProduct(payload: AdminProductPayload): Promise<Product> {
  return request<Product>(API_ENDPOINTS.admin.products, {
    method: 'POST',
    body: payload,
  })
}

export async function updateAdminProduct(productId: string, payload: Partial<AdminProductPayload>): Promise<Product> {
  return request<Product>(API_ENDPOINTS.admin.productDetail.replace(':id', productId), {
    method: 'PATCH',
    body: payload,
  })
}

export async function deleteAdminProduct(productId: string): Promise<Product> {
  return request<Product>(API_ENDPOINTS.admin.productDetail.replace(':id', productId), {
    method: 'DELETE',
  })
}

export async function fetchAdminOrders(): Promise<Order[]> {
  return request<Order[]>(API_ENDPOINTS.admin.orders)
}

export async function updateAdminOrder(
  orderId: string,
  payload: {
    status?: 'pending' | 'processing' | 'completed'
    paymentMethod?: 'cod' | 'banking'
  },
): Promise<Order> {
  return request<Order>(API_ENDPOINTS.admin.orderDetail.replace(':id', orderId), {
    method: 'PATCH',
    body: payload,
  })
}

export async function deleteAdminOrder(orderId: string): Promise<Order> {
  return request<Order>(API_ENDPOINTS.admin.orderDetail.replace(':id', orderId), {
    method: 'DELETE',
  })
}
