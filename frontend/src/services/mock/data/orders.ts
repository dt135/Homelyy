import type { Order } from '../../../types/order'

export const defaultOrders: Order[] = [
  {
    id: 'OD-1001',
    userId: 'user-1',
    items: [
      { productId: 'af-510', quantity: 1 },
      { productId: 'light-eco', quantity: 2 },
    ],
    totalAmount: 4170000,
    paymentMethod: 'cod',
    shippingAddress: {
      fullName: 'Demo User',
      phone: '0900000001',
      city: 'Hồ Chí Minh',
      district: 'Quận 7',
      addressLine: '123 Nguyễn Văn Linh',
    },
    status: 'completed',
    createdAt: '2026-02-15T08:45:00.000Z',
  },
]
