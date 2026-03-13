import { API_ENDPOINTS } from '../constants/endpoints'
import type { Order } from '../types/order'
import type { Product, ProductMedia } from '../types/product'
import { request } from './httpClient'

export type AdminCategory = {
  id: string
  name: string
}

export type AdminCategoryPayload = {
  id?: string
  name: string
}

export type AdminDashboardStats = {
  totalUsers: number
  totalProducts: number
  totalCategories: number
  pendingOrders: number
  totalRevenue: number
}

export type AdminUser = {
  id: string
  fullName: string
  email: string
  role: 'user' | 'admin'
  phone?: string
  avatarUrl?: string
  createdAt?: string
  updatedAt?: string
}

export type AdminUserPayload = {
  id?: string
  fullName: string
  email: string
  phone?: string
  role: 'user' | 'admin'
  password: string
}

export type AdminUserUpdatePayload = {
  fullName?: string
  email?: string
  phone?: string
  role?: 'user' | 'admin'
  password?: string
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
  thumbnailPublicId?: string
  media?: ProductMedia[]
  images?: string[]
  imagePublicIds?: string[]
  specs?: Record<string, string>
  isFeatured?: boolean
  isNew?: boolean
}

export async function fetchAdminCategories(): Promise<AdminCategory[]> {
  return request<AdminCategory[]>(API_ENDPOINTS.admin.categories)
}

export async function fetchAdminDashboardStats(): Promise<AdminDashboardStats> {
  return request<AdminDashboardStats>(API_ENDPOINTS.admin.dashboard)
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

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  return request<AdminUser[]>(API_ENDPOINTS.admin.users)
}

export async function createAdminUser(payload: AdminUserPayload): Promise<AdminUser> {
  return request<AdminUser>(API_ENDPOINTS.admin.users, {
    method: 'POST',
    body: payload,
  })
}

export async function updateAdminUser(userId: string, payload: AdminUserUpdatePayload): Promise<AdminUser> {
  return request<AdminUser>(API_ENDPOINTS.admin.userDetail.replace(':id', userId), {
    method: 'PATCH',
    body: payload,
  })
}

export async function deleteAdminUser(userId: string): Promise<AdminUser> {
  return request<AdminUser>(API_ENDPOINTS.admin.userDetail.replace(':id', userId), {
    method: 'DELETE',
  })
}

export async function fetchAdminProducts(): Promise<Product[]> {
  return request<Product[]>(API_ENDPOINTS.admin.products)
}

export async function createAdminProduct(payload: AdminProductPayload | FormData): Promise<Product> {
  return request<Product>(API_ENDPOINTS.admin.products, {
    method: 'POST',
    body: payload,
  })
}

export async function updateAdminProduct(
  productId: string,
  payload: Partial<AdminProductPayload> | FormData,
): Promise<Product> {
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
