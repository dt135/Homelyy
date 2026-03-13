import { API_ENDPOINTS } from '../constants/endpoints'
import type { CheckoutPayload, Order } from '../types/order'
import { request } from './httpClient'

export async function createOrder(userId: string, payload: CheckoutPayload): Promise<Order> {
  return request<Order>(API_ENDPOINTS.orders.create, {
    method: 'POST',
    body: {
      ...payload,
      userId,
    },
  })
}

export async function fetchOrdersByUser(userId: string): Promise<Order[]> {
  return request<Order[]>(`${API_ENDPOINTS.orders.list}?userId=${encodeURIComponent(userId)}`)
}

export async function fetchAllOrders(): Promise<Order[]> {
  return request<Order[]>(API_ENDPOINTS.orders.list)
}
