const { orders, products, users } = require('../models/mockDb')

function getDashboardStats() {
  const pendingOrders = orders.filter((order) => order.status === 'pending').length
  const totalRevenue = orders.reduce((total, order) => total + order.totalAmount, 0)

  return {
    totalUsers: users.length,
    totalProducts: products.length,
    pendingOrders,
    totalRevenue,
  }
}

module.exports = {
  getDashboardStats,
}
