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
    categories: '/admin/categories',
    categoryDetail: '/admin/categories/:id',
    products: '/admin/products',
    productDetail: '/admin/products/:id',
    orders: '/admin/orders',
    orderDetail: '/admin/orders/:id',
  },
} as const
