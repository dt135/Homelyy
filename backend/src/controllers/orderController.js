const orderService = require('../services/orderService')

function getOrders(req, res, next) {
  try {
    const orders = orderService.listOrders(req.query.userId)
    return res.status(200).json({ message: 'Lấy đơn hàng thành công', data: orders })
  } catch (error) {
    return next(error)
  }
}

function createOrder(req, res, next) {
  try {
    const createdOrder = orderService.createOrder(req.body)
    return res.status(201).json({ message: 'Tạo đơn hàng thành công', data: createdOrder })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getOrders,
  createOrder,
}
