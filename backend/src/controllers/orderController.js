const orderService = require('../services/orderService')

async function getOrders(req, res, next) {
  try {
    const orders = await orderService.listOrders(req.query.userId)
    return res.status(200).json({ message: 'Lấy đơn hàng thành công', data: orders })
  } catch (error) {
    return next(error)
  }
}

async function createOrder(req, res, next) {
  try {
    const createdOrder = await orderService.createOrder(req.body)
    return res.status(201).json({ message: 'Tạo đơn hàng thành công', data: createdOrder })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getOrders,
  createOrder,
}
