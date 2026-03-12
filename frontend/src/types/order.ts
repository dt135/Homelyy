import type { CartItem } from './cart'

export type PaymentMethod = 'cod' | 'banking'

export type ShippingAddress = {
  fullName: string
  phone: string
  city: string
  district: string
  addressLine: string
}

export type Order = {
  id: string
  userId: string
  items: CartItem[]
  totalAmount: number
  paymentMethod: PaymentMethod
  shippingAddress: ShippingAddress
  status: 'pending' | 'processing' | 'completed'
  createdAt: string
}

export type CheckoutPayload = {
  items: CartItem[]
  paymentMethod: PaymentMethod
  shippingAddress: ShippingAddress
}
