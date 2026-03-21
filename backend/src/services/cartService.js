const Cart = require('../models/CartModel')
const Product = require('../models/ProductModel')

function createValidationError(message, statusCode = 422) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

function assertCustomerUser(authUser) {
  if (!authUser?.id) {
    throw createValidationError('Thiếu thông tin người dùng', 401)
  }

  if (authUser.role === 'admin') {
    throw createValidationError('Tài khoản admin không được sử dụng giỏ hàng', 403)
  }

  return authUser.id
}

async function getCart(authUser) {
  const userId = assertCustomerUser(authUser)
  const cart = await Cart.findOne({ userId })
  return cart ? cart.items : []
}

async function updateCart(authUser, items) {
  const userId = assertCustomerUser(authUser)
  const nextItems = Array.isArray(items) ? items : []
  const productIds = nextItems.map((item) => item.productId)
  const products = await Product.find({ id: { $in: productIds } }).select('id name stock')
  const productMap = new Map(products.map((product) => [product.id, product]))

  nextItems.forEach((item) => {
    const quantity = Number(item.quantity || 0)
    const product = productMap.get(item.productId)

    if (!item.productId || !Number.isInteger(quantity) || quantity <= 0) {
      throw createValidationError('Thông tin giỏ hàng không hợp lệ')
    }

    if (!product) {
      throw createValidationError(`Không tìm thấy sản phẩm ${item.productId}`, 404)
    }

    if (Number(product.stock || 0) <= 0) {
      throw createValidationError(`${product.name || item.productId} đã hết hàng`, 409)
    }

    if (quantity > Number(product.stock || 0)) {
      throw createValidationError(`${product.name || item.productId} chỉ còn ${product.stock} sản phẩm trong kho`, 409)
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
