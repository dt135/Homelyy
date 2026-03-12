const adminService = require('../services/adminService')
const { orders, products } = require('../models/mockDb')

function getDashboard(_req, res, next) {
  try {
    const stats = adminService.getDashboardStats()
    return res.status(200).json({ message: 'Lấy thống kê quản trị thành công', data: stats })
  } catch (error) {
    return next(error)
  }
}

function getProductManagement(_req, res, next) {
  try {
    return res.status(200).json({ message: 'Lấy danh sách sản phẩm quản trị thành công', data: products })
  } catch (error) {
    return next(error)
  }
}

function getOrderManagement(_req, res, next) {
  try {
    return res.status(200).json({ message: 'Lấy danh sách đơn hàng quản trị thành công', data: orders })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getDashboard,
  getProductManagement,
  getOrderManagement,
}
