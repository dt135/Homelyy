const Cart = require('../models/CartModel')
const Product = require('../models/ProductModel')

function createValidationError(message, statusCode = 422) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

async function getCart(userId) {
  const cart = await Cart.findOne({ userId })
  return cart ? cart.items : []
}

async function updateCart(userId, items) {
  if (!userId) {
    throw new Error('Thiếu userId để cập nhật giỏ hàng')
  }

  const nextItems = Array.isArray(items) ? items : []
  const productIds = nextItems.map((item) => item.productId)
  const products = await Product.find({ id: { $in: productIds } }).select('id name stock')
  const productMap = new Map(products.map((product) => [product.id, product]))

  nextItems.forEach((item) => {
    const quantity = Number(item.quantity || 0)
    const product = productMap.get(item.productId)

    if (!item.productId || !Number.isInteger(quantity) || quantity <= 0) {
      throw createValidationError('Thong tin gio hang khong hop le')
    }

    if (!product) {
      throw createValidationError(`Khong tim thay san pham ${item.productId}`, 404)
    }

    if (Number(product.stock || 0) <= 0) {
      throw createValidationError(`${product.name || item.productId} da het hang`, 409)
    }

    if (quantity > Number(product.stock || 0)) {
      throw createValidationError(`${product.name || item.productId} chi con ${product.stock} san pham trong kho`, 409)
    }
  })

  const updated = await Cart.findOneAndUpdate(
    { userId },
    {
      $set: {
        items: nextItems,
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
