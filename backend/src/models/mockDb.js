const users = [
  {
    id: 'user-1',
    fullName: 'Demo User',
    email: 'demo@homelyy.local',
    password: '123456',
    role: 'user',
  },
  {
    id: 'admin-1',
    fullName: 'Admin Homelyy',
    email: 'admin@homelyy.local',
    password: 'admin123',
    role: 'admin',
  },
]

const categories = [
  { id: 'cat-1', name: 'Nhà bếp' },
  { id: 'cat-2', name: 'Vệ sinh' },
  { id: 'cat-3', name: 'Không khí' },
  { id: 'cat-4', name: 'Nhà thông minh' },
]

const products = [
  {
    id: 'af-510',
    name: 'Nồi chiên không dầu LuxAir 5L',
    category: 'Nhà bếp',
    brand: 'Modena Kitchen',
    price: 2590000,
    rating: 4.8,
    stock: 36,
  },
  {
    id: 'vc-x2',
    name: 'Máy hút bụi SmartClean X2',
    category: 'Vệ sinh',
    brand: 'Swift Electric',
    price: 3290000,
    rating: 4.7,
    stock: 21,
  },
  {
    id: 'ac-guard',
    name: 'Máy lọc không khí AirGuard S',
    category: 'Không khí',
    brand: 'Aeris',
    price: 4190000,
    rating: 4.9,
    stock: 19,
  },
]

const orders = [
  {
    id: 'OD-1001',
    userId: 'user-1',
    items: [{ productId: 'af-510', quantity: 1 }],
    totalAmount: 2590000,
    status: 'completed',
    createdAt: '2026-02-15T08:45:00.000Z',
  },
]

const reviews = []

module.exports = {
  users,
  categories,
  products,
  orders,
  reviews,
}
