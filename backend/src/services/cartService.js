const Cart = require('../models/CartModel')

async function getCart(userId) {
  const cart = await Cart.findOne({ userId })
  return cart ? cart.items : []
}

async function updateCart(userId, items) {
  if (!userId) {
    throw new Error('Thiếu userId để cập nhật giỏ hàng')
  }

  const updated = await Cart.findOneAndUpdate(
    { userId },
    {
      $set: {
        items,
        updatedAt: new Date(),
      },
    },
    { upsert: true, new: true, runValidators: true },
  )

  return updated.items
}

module.exports = {
  getCart,
  updateCart,
}
