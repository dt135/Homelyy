const orderService = require('../services/orderService')

async function getOrders(req, res, next) {
  try {
    const orders = await orderService.listOrders(req.authUser, req.query.userId)
    return res.status(200).json({ message: 'Lay don hang thanh cong', data: orders })
  } catch (error) {
    return next(error)
  }
}

async function createOrder(req, res, next) {
  try {
    const createdOrder = await orderService.createOrder(req.authUser, req.body)
    return res.status(201).json({ message: 'Tao don hang thanh cong', data: createdOrder })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getOrders,
  createOrder,
}
