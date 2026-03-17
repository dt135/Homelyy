import { API_ENDPOINTS } from '../constants/endpoints'
import type { CheckoutPayload, Order } from '../types/order'
import { request } from './httpClient'

export async function createOrder(payload: CheckoutPayload): Promise<Order> {
  return request<Order>(API_ENDPOINTS.orders.create, {
    method: 'POST',
    body: payload,
  })
}

export async function fetchOrdersByUser(): Promise<Order[]> {
  return request<Order[]>(API_ENDPOINTS.orders.list)
}

export async function fetchAllOrders(): Promise<Order[]> {
  return request<Order[]>(API_ENDPOINTS.orders.list)
}
