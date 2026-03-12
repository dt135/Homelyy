export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    profile: '/auth/profile',
  },
  products: {
    list: '/products',
    detail: '/products/:id',
  },
  categories: {
    list: '/categories',
  },
  cart: {
    current: '/cart',
  },
  orders: {
    list: '/orders',
    create: '/orders',
  },
  users: {
    list: '/users',
    detail: '/users/:id',
    profile: '/users',
  },
  admin: {
    dashboard: '/admin/dashboard',
    products: '/admin/products',
    orders: '/admin/orders',
  },
} as const
