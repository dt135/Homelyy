const Category = require('../models/CategoryModel')
const Order = require('../models/OrderModel')
const Product = require('../models/ProductModel')
const User = require('../models/UserModel')
const { sanitizeDoc, sanitizeDocs } = require('../utils/mongoSanitize')

function toSlug(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function ensureUniqueProductSlug(baseSlug, currentProductId) {
  const base = baseSlug || `san-pham-${Date.now()}`
  let candidate = base
  let index = 1

  while (true) {
    const found = await Product.findOne({ slug: candidate }).select('id')
    if (!found || found.id === currentProductId) {
      return candidate
    }
    candidate = `${base}-${index}`
    index += 1
  }
}

function toPositiveNumber(value, fallback = 0) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback
  }
  return parsed
}

function normalizeSpecs(specs) {
  if (!specs || typeof specs !== 'object' || Array.isArray(specs)) {
    return {}
  }
  return Object.fromEntries(
    Object.entries(specs).map(([key, value]) => [String(key), String(value)]),
  )
}

async function getDashboardStats() {
  const [totalUsers, totalProducts, totalCategories, pendingOrders, revenueRows] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Category.countDocuments(),
    Order.countDocuments({ status: 'pending' }),
    Order.aggregate([{ $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }]),
  ])

  const totalRevenue = revenueRows[0]?.totalRevenue || 0

  return {
    totalUsers,
    totalProducts,
    totalCategories,
    pendingOrders,
    totalRevenue,
  }
}

async function getCategoriesForAdmin() {
  const categories = await Category.find().sort({ createdAt: -1 })
  return sanitizeDocs(categories)
}

async function createCategoryForAdmin(payload) {
  const name = String(payload.name || '').trim()
  if (!name) {
    throw new Error('Tên danh mục là bắt buộc')
  }

  const existedCategory = await Category.findOne({
    name: { $regex: `^${escapeRegex(name)}$`, $options: 'i' },
  }).select('id')
  if (existedCategory) {
    throw new Error('Danh mục đã tồn tại')
  }

  const id = String(payload.id || `cat-${Date.now()}`)
  const existingById = await Category.findOne({ id }).select('id')
  if (existingById) {
    throw new Error('ID danh mục đã tồn tại')
  }

  const createdCategory = await Category.create({ id, name })
  return sanitizeDoc(createdCategory)
}

async function updateCategoryForAdmin(categoryId, payload) {
  const category = await Category.findOne({ id: categoryId })
  if (!category) {
    throw new Error('Không tìm thấy danh mục để cập nhật')
  }

  const nextName = String(payload.name || '').trim()
  if (!nextName) {
    throw new Error('Tên danh mục là bắt buộc')
  }

  const existedCategory = await Category.findOne({
    id: { $ne: categoryId },
    name: { $regex: `^${escapeRegex(nextName)}$`, $options: 'i' },
  }).select('id')

  if (existedCategory) {
    throw new Error('Danh mục đã tồn tại')
  }

  const oldName = category.name
  category.name = nextName
  await category.save()

  if (oldName !== nextName) {
    await Product.updateMany({ category: oldName }, { $set: { category: nextName } })
  }

  return sanitizeDoc(category)
}

async function deleteCategoryForAdmin(categoryId) {
  const category = await Category.findOne({ id: categoryId })
  if (!category) {
    throw new Error('Không tìm thấy danh mục để xóa')
  }

  const linkedProducts = await Product.countDocuments({ category: category.name })
  if (linkedProducts > 0) {
    throw new Error('Không thể xóa danh mục đang có sản phẩm')
  }

  await category.deleteOne()
  return sanitizeDoc(category)
}

async function getProductsForAdmin() {
  const products = await Product.find().sort({ createdAt: -1 })
  return sanitizeDocs(products)
}

async function getOrdersForAdmin() {
  const orders = await Order.find().sort({ createdAt: -1 })
  return sanitizeDocs(orders)
}

async function createProductForAdmin(payload) {
  const name = String(payload.name || '').trim()
  const category = String(payload.category || '').trim()
  const brand = String(payload.brand || '').trim()
  const description = String(payload.description || '').trim()

  if (!name || !category || !brand || !description) {
    throw new Error('Thiếu thông tin bắt buộc: tên, danh mục, thương hiệu, mô tả')
  }

  const id = String(payload.id || `prd-${Date.now()}`)
  const existingById = await Product.findOne({ id }).select('id')
  if (existingById) {
    throw new Error('ID sản phẩm đã tồn tại')
  }

  const preferredSlug = toSlug(payload.slug || name)
  const slug = await ensureUniqueProductSlug(preferredSlug)

  const product = await Product.create({
    id,
    slug,
    name,
    description,
    category,
    brand,
    price: toPositiveNumber(payload.price),
    oldPrice: payload.oldPrice == null ? null : toPositiveNumber(payload.oldPrice),
    rating: toPositiveNumber(payload.rating),
    stock: toPositiveNumber(payload.stock),
    sold: toPositiveNumber(payload.sold),
    thumbnail: String(payload.thumbnail || name.toUpperCase()).trim(),
    images: Array.isArray(payload.images) ? payload.images.map((item) => String(item)) : [],
    specs: normalizeSpecs(payload.specs),
    isFeatured: Boolean(payload.isFeatured),
    isNew: Boolean(payload.isNew),
  })

  return sanitizeDoc(product)
}

async function updateProductForAdmin(productId, payload) {
  const product = await Product.findOne({ id: productId })
  if (!product) {
    throw new Error('Không tìm thấy sản phẩm để cập nhật')
  }

  if (payload.name != null) {
    product.name = String(payload.name).trim()
  }
  if (payload.description != null) {
    product.description = String(payload.description).trim()
  }
  if (payload.category != null) {
    product.category = String(payload.category).trim()
  }
  if (payload.brand != null) {
    product.brand = String(payload.brand).trim()
  }
  if (payload.price != null) {
    product.price = toPositiveNumber(payload.price)
  }
  if (payload.oldPrice != null) {
    product.oldPrice = payload.oldPrice === '' ? null : toPositiveNumber(payload.oldPrice)
  }
  if (payload.rating != null) {
    product.rating = toPositiveNumber(payload.rating)
  }
  if (payload.stock != null) {
    product.stock = toPositiveNumber(payload.stock)
  }
  if (payload.sold != null) {
    product.sold = toPositiveNumber(payload.sold)
  }
  if (payload.thumbnail != null) {
    product.thumbnail = String(payload.thumbnail).trim()
  }
  if (payload.images != null) {
    product.images = Array.isArray(payload.images) ? payload.images.map((item) => String(item)) : []
  }
  if (payload.specs != null) {
    product.specs = normalizeSpecs(payload.specs)
  }
  if (payload.isFeatured != null) {
    product.isFeatured = Boolean(payload.isFeatured)
  }
  if (payload.isNew != null) {
    product.isNew = Boolean(payload.isNew)
  }

  if (payload.slug != null || payload.name != null) {
    const preferredSlug = toSlug(payload.slug || product.name)
    product.slug = await ensureUniqueProductSlug(preferredSlug, productId)
  }

  await product.save()
  return sanitizeDoc(product)
}

async function deleteProductForAdmin(productId) {
  const deleted = await Product.findOneAndDelete({ id: productId })
  if (!deleted) {
    throw new Error('Không tìm thấy sản phẩm để xóa')
  }
  return sanitizeDoc(deleted)
}

async function updateOrderForAdmin(orderId, payload) {
  const order = await Order.findOne({ id: orderId })
  if (!order) {
    throw new Error('Không tìm thấy đơn hàng để cập nhật')
  }

  if (payload.status != null) {
    const allowedStatuses = ['pending', 'processing', 'completed']
    if (!allowedStatuses.includes(payload.status)) {
      throw new Error('Trạng thái đơn hàng không hợp lệ')
    }
    order.status = payload.status
  }

  if (payload.paymentMethod != null) {
    const allowedPaymentMethods = ['cod', 'banking']
    if (!allowedPaymentMethods.includes(payload.paymentMethod)) {
      throw new Error('Phương thức thanh toán không hợp lệ')
    }
    order.paymentMethod = payload.paymentMethod
  }

  await order.save()
  return sanitizeDoc(order)
}

async function deleteOrderForAdmin(orderId) {
  const deleted = await Order.findOneAndDelete({ id: orderId })
  if (!deleted) {
    throw new Error('Không tìm thấy đơn hàng để xóa')
  }
  return sanitizeDoc(deleted)
}

module.exports = {
  getDashboardStats,
  getCategoriesForAdmin,
  getProductsForAdmin,
  getOrdersForAdmin,
  createCategoryForAdmin,
  updateCategoryForAdmin,
  deleteCategoryForAdmin,
  createProductForAdmin,
  updateProductForAdmin,
  deleteProductForAdmin,
  updateOrderForAdmin,
  deleteOrderForAdmin,
}
