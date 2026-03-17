const Order = require('../models/OrderModel')
const Product = require('../models/ProductModel')
const { sanitizeDoc, sanitizeDocs } = require('../utils/mongoSanitize')

function createAuthorizationError(message) {
  const error = new Error(message)
  error.statusCode = 403
  return error
}

async function listOrders(authUser, requestedUserId) {
  if (!authUser?.id) {
    throw createAuthorizationError('Ban can dang nhap de xem don hang')
  }

  const filters = {}

  if (authUser.role === 'admin') {
    if (requestedUserId) {
      filters.userId = requestedUserId
    }
  } else {
    filters.userId = authUser.id
  }

  const orders = await Order.find(filters).sort({ createdAt: -1 })
  return sanitizeDocs(orders)
}

async function createOrder(authUser, payload) {
  if (!authUser?.id) {
    throw createAuthorizationError('Ban can dang nhap truoc khi tao don hang')
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    throw new Error('Don hang phai co it nhat mot san pham')
  }

  const productIds = payload.items.map((item) => item.productId)
  const products = await Product.find({ id: { $in: productIds } }).select('id price')
  const productMap = new Map(products.map((product) => [product.id, Number(product.price)]))

  const normalizedItems = payload.items.map((item) => {
    const quantity = Number(item.quantity || 0)

    if (!item.productId || !Number.isFinite(quantity) || quantity <= 0) {
      const error = new Error('Thong tin san pham trong don hang khong hop le')
      error.statusCode = 422
      throw error
    }

    const dbPrice = productMap.get(item.productId)
    if (!Number.isFinite(dbPrice)) {
      const error = new Error(`Khong tim thay san pham ${item.productId}`)
      error.statusCode = 404
      throw error
    }

    return {
      productId: item.productId,
      quantity,
      price: dbPrice,
    }
  })

  const totalAmount = normalizedItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const createdOrder = await Order.create({
    id: `OD-${Date.now()}`,
    userId: authUser.id,
    items: normalizedItems,
    paymentMethod: payload.paymentMethod || 'cod',
    shippingAddress: payload.shippingAddress || {},
    totalAmount,
    status: 'pending',
    createdAt: new Date(),
  })

  return sanitizeDoc(createdOrder)
}

module.exports = {
  listOrders,
  createOrder,
}
