const cartService = require('../services/cartService')

async function getCart(req, res, next) {
  try {
    const cart = await cartService.getCart(req.authUser.id)
    return res.status(200).json({ message: 'Lấy giỏ hàng thành công', data: cart })
  } catch (error) {
    return next(error)
  }
}

async function updateCart(req, res, next) {
  try {
    const cart = await cartService.updateCart(req.authUser.id, req.body.items || [])
    return res.status(200).json({ message: 'Cập nhật giỏ hàng thành công', data: cart })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getCart,
  updateCart,
}
