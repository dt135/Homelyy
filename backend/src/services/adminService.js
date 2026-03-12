const Category = require('../models/CategoryModel')
const Order = require('../models/OrderModel')
const Product = require('../models/ProductModel')
const User = require('../models/UserModel')
const { sanitizeDoc, sanitizeDocs } = require('../utils/mongoSanitize')
const {
  normalizeEmail,
  normalizePhone,
  validateEmail,
  validateFullName,
  validatePassword,
  validateRole,
} = require('../utils/validation')

function createHttpError(message, statusCode) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

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

function parseBooleanInput(value) {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (normalized === 'true') {
      return true
    }
    if (normalized === 'false') {
      return false
    }
  }

  return Boolean(value)
}

function normalizeCustomId(value, prefix) {
  const raw = String(value || '').trim()

  if (!raw) {
    return `${prefix}-${Date.now()}`
  }

  if (!/^[a-zA-Z0-9-]{3,50}$/.test(raw)) {
    throw createHttpError('ID chỉ được chứa chữ, số, dấu gạch ngang (3-50 ký tự)', 422)
  }

  return raw
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

async function getUsersForAdmin() {
  const users = await User.find()
    .select('id fullName email role phone createdAt updatedAt')
    .sort({ createdAt: -1 })
  return sanitizeDocs(users)
}

async function createUserForAdmin(payload) {
  const input = payload && typeof payload === 'object' ? payload : {}

  const fullName = validateFullName(input.fullName)
  const email = validateEmail(normalizeEmail(input.email))
  const password = validatePassword(input.password)
  const role = validateRole(input.role, { defaultToUser: true })
  const phone = normalizePhone(input.phone)
  const id = normalizeCustomId(input.id, role === 'admin' ? 'admin' : 'user')

  const [existingById, existingByEmail] = await Promise.all([
    User.findOne({ id }).select('id'),
    User.findOne({ email }).select('id'),
  ])

  if (existingById) {
    throw createHttpError('ID người dùng đã tồn tại', 409)
  }

  if (existingByEmail) {
    throw createHttpError('Email đã tồn tại', 409)
  }

  const createdUser = await User.create({
    id,
    fullName,
    email,
    password,
    role,
    phone,
  })

  return sanitizeDoc({
    id: createdUser.id,
    fullName: createdUser.fullName,
    email: createdUser.email,
    role: createdUser.role,
    phone: createdUser.phone,
    createdAt: createdUser.createdAt,
    updatedAt: createdUser.updatedAt,
  })
}

async function updateUserForAdmin(userId, payload, authUserId) {
  const input = payload && typeof payload === 'object' ? payload : {}
  const user = await User.findOne({ id: userId })
  if (!user) {
    throw createHttpError('Không tìm thấy người dùng để cập nhật', 404)
  }

  const shouldUpdateFullName = Object.prototype.hasOwnProperty.call(input, 'fullName')
  const shouldUpdateEmail = Object.prototype.hasOwnProperty.call(input, 'email')
  const shouldUpdatePhone = Object.prototype.hasOwnProperty.call(input, 'phone')
  const shouldUpdateRole = Object.prototype.hasOwnProperty.call(input, 'role')
  const shouldUpdatePassword = Object.prototype.hasOwnProperty.call(input, 'password')

  if (
    !shouldUpdateFullName &&
    !shouldUpdateEmail &&
    !shouldUpdatePhone &&
    !shouldUpdateRole &&
    !shouldUpdatePassword
  ) {
    throw createHttpError('Không có dữ liệu hợp lệ để cập nhật', 422)
  }

  if (shouldUpdateFullName) {
    user.fullName = validateFullName(input.fullName)
  }

  if (shouldUpdateEmail) {
    const nextEmail = validateEmail(normalizeEmail(input.email))
    const duplicateEmailUser = await User.findOne({
      id: { $ne: userId },
      email: nextEmail,
    }).select('id')

    if (duplicateEmailUser) {
      throw createHttpError('Email đã tồn tại', 409)
    }

    user.email = nextEmail
  }

  if (shouldUpdatePhone) {
    user.phone = normalizePhone(input.phone)
  }

  if (shouldUpdatePassword) {
    user.password = validatePassword(input.password)
  }

  if (shouldUpdateRole) {
    const nextRole = validateRole(input.role)

    if (authUserId === userId && nextRole !== 'admin') {
      throw createHttpError('Không thể tự hạ quyền tài khoản đang đăng nhập', 422)
    }

    if (user.role === 'admin' && nextRole !== 'admin') {
      const remainingAdmins = await User.countDocuments({
        role: 'admin',
        id: { $ne: userId },
      })

      if (remainingAdmins < 1) {
        throw createHttpError('Hệ thống phải luôn có ít nhất 1 tài khoản admin', 422)
      }
    }

    user.role = nextRole
  }

  await user.save()

  return sanitizeDoc({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    phone: user.phone,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  })
}

async function deleteUserForAdmin(userId, authUserId) {
  if (userId === authUserId) {
    throw createHttpError('Không thể tự xóa tài khoản đang đăng nhập', 422)
  }

  const user = await User.findOne({ id: userId })
  if (!user) {
    throw createHttpError('Không tìm thấy người dùng để xóa', 404)
  }

  if (user.role === 'admin') {
    const remainingAdmins = await User.countDocuments({
      role: 'admin',
      id: { $ne: userId },
    })

    if (remainingAdmins < 1) {
      throw createHttpError('Không thể xóa tài khoản admin cuối cùng', 422)
    }
  }

  await user.deleteOne()

  return sanitizeDoc({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    phone: user.phone,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  })
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
    isFeatured: parseBooleanInput(payload.isFeatured),
    isNew: parseBooleanInput(payload.isNew),
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
    product.isFeatured = parseBooleanInput(payload.isFeatured)
  }
  if (payload.isNew != null) {
    product.isNew = parseBooleanInput(payload.isNew)
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
  getUsersForAdmin,
  createCategoryForAdmin,
  updateCategoryForAdmin,
  deleteCategoryForAdmin,
  createUserForAdmin,
  updateUserForAdmin,
  deleteUserForAdmin,
  createProductForAdmin,
  updateProductForAdmin,
  deleteProductForAdmin,
  updateOrderForAdmin,
  deleteOrderForAdmin,
}
