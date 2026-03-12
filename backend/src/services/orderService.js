const { orders } = require('../models/mockDb')

function listOrders(userId) {
  if (!userId) {
    return orders
  }
  return orders.filter((order) => order.userId === userId)
}

function createOrder(payload) {
  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    throw new Error('Đơn hàng phải có ít nhất một sản phẩm')
  }

  const totalAmount = payload.items.reduce((total, item) => {
    return total + Number(item.price || 0) * Number(item.quantity || 0)
  }, 0)

  const order = {
    id: `OD-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: payload.userId || 'guest',
    items: payload.items,
    totalAmount,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }

  orders.unshift(order)
  return order
}

module.exports = {
  listOrders,
  createOrder,
}
