const Order = require('../models/OrderModel')
const Product = require('../models/ProductModel')
const { sanitizeDoc, sanitizeDocs } = require('../utils/mongoSanitize')

async function listOrders(userId) {
  const filters = {}
  if (userId) {
    filters.userId = userId
  }
  const orders = await Order.find(filters).sort({ createdAt: -1 })
  return sanitizeDocs(orders)
}

async function createOrder(payload) {
  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    throw new Error('Đơn hàng phải có ít nhất một sản phẩm')
  }

  const productIds = payload.items.map((item) => item.productId)
  const products = await Product.find({ id: { $in: productIds } }).select('id price')
  const productMap = new Map(products.map((product) => [product.id, Number(product.price)]))

  const normalizedItems = payload.items.map((item) => {
    const quantity = Number(item.quantity || 0)
    if (!item.productId || !Number.isFinite(quantity) || quantity <= 0) {
      throw new Error('Thông tin sản phẩm trong đơn hàng không hợp lệ')
    }

    const dbPrice = productMap.get(item.productId)
    const fallbackPrice = Number(item.price || 0)
    const unitPrice = Number.isFinite(dbPrice) ? dbPrice : fallbackPrice

    return {
      productId: item.productId,
      quantity,
      price: unitPrice,
    }
  })

  const totalAmount = normalizedItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const createdOrder = await Order.create({
    id: `OD-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: payload.userId || 'guest',
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
