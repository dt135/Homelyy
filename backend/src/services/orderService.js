const Order = require('../models/OrderModel')
const Product = require('../models/ProductModel')
const { sanitizeDoc, sanitizeDocs } = require('../utils/mongoSanitize')

function createAuthorizationError(message) {
  const error = new Error(message)
  error.statusCode = 403
  return error
}

function createValidationError(message, statusCode = 422) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

async function rollbackReservedStock(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return
  }

  await Promise.all(
    items.map((item) =>
      Product.updateOne(
        { id: item.productId },
        {
          $inc: {
            stock: item.quantity,
            sold: -item.quantity,
          },
        },
      ),
    ),
  )
}

async function listOrders(authUser, requestedUserId) {
  if (!authUser?.id) {
    throw createAuthorizationError('Ban can dang nhap de xem don hang')
  }

  const filters = {}

  if (authUser.role === 'admin') {
    if (requestedUserId) {
      filters.userId = requestedUserId
    }
  } else {
    filters.userId = authUser.id
  }

  const orders = await Order.find(filters).sort({ createdAt: -1 })
  return sanitizeDocs(orders)
}

async function createOrder(authUser, payload) {
  if (!authUser?.id) {
    throw createAuthorizationError('Ban can dang nhap truoc khi tao don hang')
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    throw createValidationError('Don hang phai co it nhat mot san pham')
  }

  const productIds = payload.items.map((item) => item.productId)
  const products = await Product.find({ id: { $in: productIds } }).select('id name price stock sold')
  const productMap = new Map(products.map((product) => [product.id, product]))

  const normalizedItems = payload.items.map((item) => {
    const quantity = Number(item.quantity || 0)

    if (!item.productId || !Number.isFinite(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
      throw createValidationError('Thong tin san pham trong don hang khong hop le')
    }

    const product = productMap.get(item.productId)
    if (!product) {
      throw createValidationError(`Khong tim thay san pham ${item.productId}`, 404)
    }

    const dbPrice = Number(product.price || 0)
    const dbStock = Number(product.stock || 0)

    if (dbStock <= 0) {
      throw createValidationError(`${product.name || item.productId} da het hang`, 409)
    }

    if (quantity > dbStock) {
      throw createValidationError(`${product.name || item.productId} chi con ${dbStock} san pham trong kho`, 409)
    }

    return {
      productId: item.productId,
      quantity,
      price: dbPrice,
    }
  })

  const totalAmount = normalizedItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const reservedItems = []
  let createdOrder = null

  try {
    for (const item of normalizedItems) {
      const reservedProduct = await Product.findOneAndUpdate(
        { id: item.productId, stock: { $gte: item.quantity } },
        {
          $inc: {
            stock: -item.quantity,
            sold: item.quantity,
          },
        },
        { new: true },
      )

      if (!reservedProduct) {
        throw createValidationError(`San pham ${item.productId} khong con du ton kho`, 409)
      }

      reservedItems.push(item)
    }

    createdOrder = await Order.create({
      id: `OD-${Date.now()}`,
      userId: authUser.id,
      items: normalizedItems,
      paymentMethod: payload.paymentMethod || 'cod',
      shippingAddress: payload.shippingAddress || {},
      totalAmount,
      status: 'pending',
      createdAt: new Date(),
    })
  } catch (error) {
    await rollbackReservedStock(reservedItems)
    throw error
  }

  return sanitizeDoc(createdOrder)
}

module.exports = {
  listOrders,
  createOrder,
}
