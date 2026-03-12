const cartService = require('../services/cartService')

function getCart(req, res, next) {
  try {
    const userId = req.query.userId || 'guest'
    const cart = cartService.getCart(userId)
    return res.status(200).json({ message: 'Lấy giỏ hàng thành công', data: cart })
  } catch (error) {
    return next(error)
  }
}

function updateCart(req, res, next) {
  try {
    const userId = req.body.userId || 'guest'
    const cart = cartService.updateCart(userId, req.body.items || [])
    return res.status(200).json({ message: 'Cập nhật giỏ hàng thành công', data: cart })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getCart,
  updateCart,
}
