import { env } from '../config/env'
import { API_ENDPOINTS } from '../constants/endpoints'
import { STORAGE_KEYS } from '../constants/storageKeys'
import type { CheckoutPayload, Order } from '../types/order'
import { readStorage, writeStorage } from '../utils/localStorage'
import { request } from './httpClient'
import { mockRequest } from './apiClient'
import { defaultOrders } from './mock/data/orders'
import { mockProducts } from './mock/data/products'

function ensureOrders(): Order[] {
  const orders = readStorage<Order[]>(STORAGE_KEYS.orders, [])
  if (orders.length > 0) {
    return orders
  }
  writeStorage(STORAGE_KEYS.orders, defaultOrders)
  return defaultOrders
}

function calculateTotal(items: CheckoutPayload['items']): number {
  return items.reduce((total, item) => {
    const product = mockProducts.find((current) => current.id === item.productId)
    if (!product) {
      return total
    }
    return total + product.price * item.quantity
  }, 0)
}

export async function createOrder(userId: string, payload: CheckoutPayload): Promise<Order> {
  if (!env.useMockApi) {
    return request<Order>(API_ENDPOINTS.orders.create, {
      method: 'POST',
      body: {
        ...payload,
        userId,
        items: payload.items.map((item) => ({
          ...item,
          price: mockProducts.find((product) => product.id === item.productId)?.price || 0,
        })),
      },
    })
  }

  return mockRequest({
    handler: () => {
      const orders = ensureOrders()
      const createdOrder: Order = {
        id: `OD-${Math.floor(1000 + Math.random() * 9000)}`,
        userId,
        items: payload.items,
        totalAmount: calculateTotal(payload.items),
        paymentMethod: payload.paymentMethod,
        shippingAddress: payload.shippingAddress,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
      const updatedOrders = [createdOrder, ...orders]
      writeStorage(STORAGE_KEYS.orders, updatedOrders)
      return createdOrder
    },
  })
}

export async function fetchOrdersByUser(userId: string): Promise<Order[]> {
  if (!env.useMockApi) {
    return request<Order[]>(`${API_ENDPOINTS.orders.list}?userId=${encodeURIComponent(userId)}`)
  }

  return mockRequest({
    handler: () => ensureOrders().filter((order) => order.userId === userId),
  })
}

export async function fetchAllOrders(): Promise<Order[]> {
  if (!env.useMockApi) {
    return request<Order[]>(API_ENDPOINTS.orders.list)
  }

  return mockRequest({
    handler: () => ensureOrders(),
  })
}
