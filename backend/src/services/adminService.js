const Category = require('../models/CategoryModel')
const Order = require('../models/OrderModel')
const Product = require('../models/ProductModel')
const User = require('../models/UserModel')
const { destroyImagesByPublicIds } = require('./cloudinaryService')
const { sanitizeDoc, sanitizeDocs } = require('../utils/mongoSanitize')
const { hashPassword } = require('../utils/password')
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

async function generateUniqueProductId() {
  let candidate = `prd-${Date.now()}`
  let index = 1

  while (true) {
    const existing = await Product.findOne({ id: candidate }).select('id')
    if (!existing) {
      return candidate
    }

    candidate = `prd-${Date.now()}-${index}`
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
  if (typeof specs === 'string') {
    try {
      const parsed = JSON.parse(specs)
      return normalizeSpecs(parsed)
    } catch (_error) {
      return {}
    }
  }

  if (!specs || typeof specs !== 'object' || Array.isArray(specs)) {
    return {}
  }
  return Object.fromEntries(
    Object.entries(specs).map(([key, value]) => [String(key), String(value)]),
  )
}

function normalizeStringArray(input) {
  if (Array.isArray(input)) {
    return input.map((item) => String(item || '').trim()).filter(Boolean)
  }

  if (input == null) {
    return []
  }

  const raw = String(input).trim()
  if (!raw) {
    return []
  }

  if (raw.startsWith('[') && raw.endsWith(']')) {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return normalizeStringArray(parsed)
      }
    } catch (_error) {
      // ignore invalid JSON and continue with comma-separated parsing
    }
  }

  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizeAssetArray(input) {
  if (Array.isArray(input)) {
    return input
      .map((item) => {
        if (!item || typeof item !== 'object') {
          return null
        }

        const url = String(item.url || '').trim()
        const publicId = String(item.publicId || '').trim()
        if (!url) {
          return null
        }

        return {
          url,
          publicId,
        }
      })
      .filter(Boolean)
  }

  return []
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

function parseNonNegativeInteger(value) {
  if (value == null || value === '') {
    return null
  }

  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 0) {
    return null
  }

  return parsed
}

function normalizeMediaInput(input, fallbackAlt) {
  let raw = input

  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (!trimmed) {
      return []
    }

    try {
      raw = JSON.parse(trimmed)
    } catch (_error) {
      return []
    }
  }

  if (!Array.isArray(raw)) {
    return []
  }

  return raw
    .map((item, index) => {
      if (!item || typeof item !== 'object') {
        return null
      }

      const url = String(item.url || '').trim()
      if (!url) {
        return null
      }

      const publicId = String(item.publicId || '').trim()
      const alt = String(item.alt || fallbackAlt || '').trim()
      const positionValue = Number(item.position)

      return {
        url,
        publicId,
        alt,
        position: Number.isFinite(positionValue) && positionValue >= 0 ? positionValue : index,
        isPrimary: parseBooleanInput(item.isPrimary),
      }
    })
    .filter(Boolean)
}

function buildMediaFromLegacyFields({ name, thumbnail, thumbnailPublicId, images, imagePublicIds }) {
  const fallbackAlt = String(name || '').trim()
  const normalizedThumbnail = String(thumbnail || '').trim()
  const galleryUrls = normalizeStringArray(images)
  const galleryPublicIds = normalizeStringArray(imagePublicIds)

  const media = []

  if (normalizedThumbnail) {
    media.push({
      url: normalizedThumbnail,
      publicId: String(thumbnailPublicId || '').trim(),
      alt: fallbackAlt,
      position: 0,
      isPrimary: true,
    })
  }

  galleryUrls.forEach((url, index) => {
    media.push({
      url,
      publicId: galleryPublicIds[index] || '',
      alt: fallbackAlt,
      position: media.length,
      isPrimary: false,
    })
  })

  return media
}

function finalizeProductMedia(items, fallbackThumbnail, fallbackName) {
  const deduped = []
  const byUrl = new Map()

  items.forEach((item) => {
    const url = String(item?.url || '').trim()
    if (!url) {
      return
    }

    const current = byUrl.get(url)
    if (current) {
      if (!current.publicId && item.publicId) {
        current.publicId = String(item.publicId).trim()
      }
      if (!current.alt && item.alt) {
        current.alt = String(item.alt).trim()
      }
      if (item.isPrimary) {
        current.isPrimary = true
      }
      return
    }

    const positionValue = Number(item.position)
    const created = {
      url,
      publicId: String(item.publicId || '').trim(),
      alt: String(item.alt || fallbackName || '').trim(),
      position: Number.isFinite(positionValue) && positionValue >= 0 ? positionValue : deduped.length,
      isPrimary: Boolean(item.isPrimary),
    }

    byUrl.set(url, created)
    deduped.push(created)
  })

  deduped.sort((a, b) => a.position - b.position)

  let primaryIndex = deduped.findIndex((item) => item.isPrimary)
  if (primaryIndex < 0 && deduped.length > 0) {
    primaryIndex = 0
  }

  const media = deduped.map((item, index) => ({
    ...item,
    position: index,
    isPrimary: index === primaryIndex,
  }))

  const primaryMedia = primaryIndex >= 0 ? media[primaryIndex] : null
  const galleryMedia = media.filter((_, index) => index !== primaryIndex)

  return {
    media,
    thumbnail: String(primaryMedia?.url || fallbackThumbnail || fallbackName || '').trim(),
    thumbnailPublicId: String(primaryMedia?.publicId || '').trim(),
    images: galleryMedia.map((item) => item.url),
    imagePublicIds: galleryMedia.map((item) => item.publicId).filter(Boolean),
  }
}

function composeProductMedia({
  name,
  inputMedia,
  existingMedia,
  thumbnail,
  thumbnailPublicId,
  images,
  imagePublicIds,
}) {
  const fallbackName = String(name || '').trim()
  const fromInput = normalizeMediaInput(inputMedia, fallbackName)

  if (fromInput.length > 0) {
    return finalizeProductMedia(fromInput, thumbnail, fallbackName)
  }

  const legacyMedia = buildMediaFromLegacyFields({
    name: fallbackName,
    thumbnail,
    thumbnailPublicId,
    images,
    imagePublicIds,
  })

  if (legacyMedia.length > 0) {
    return finalizeProductMedia(legacyMedia, thumbnail, fallbackName)
  }

  const fromExisting = normalizeMediaInput(existingMedia, fallbackName)
  return finalizeProductMedia(fromExisting, thumbnail, fallbackName)
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

  const existedCategoryByName = await Category.findOne({
    _id: { $ne: category._id },
    name: { $regex: `^${escapeRegex(nextName)}$`, $options: 'i' },
  }).select('id')

  if (existedCategoryByName) {
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
    .select('id fullName email role phone avatarUrl createdAt updatedAt')
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
    password: hashPassword(password),
    role,
    phone,
    avatarUrl: '',
    avatarPublicId: '',
  })

  return sanitizeDoc({
    id: createdUser.id,
    fullName: createdUser.fullName,
    email: createdUser.email,
    role: createdUser.role,
    phone: createdUser.phone,
    avatarUrl: createdUser.avatarUrl,
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
    user.password = hashPassword(validatePassword(input.password))
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
    avatarUrl: user.avatarUrl,
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

  if (user.avatarPublicId) {
    await destroyImagesByPublicIds(user.avatarPublicId)
  }

  return sanitizeDoc({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  })
}

async function createProductForAdmin(payload, uploadedAssets = {}) {
  const input = payload && typeof payload === 'object' ? payload : {}
  const uploadedThumbnail = uploadedAssets?.thumbnail || null
  const uploadedImageAssets = normalizeAssetArray(uploadedAssets?.images)

  const name = String(input.name || '').trim()
  const category = String(input.category || '').trim()
  const brand = String(input.brand || '').trim()
  const description = String(input.description || '').trim()

  if (!name || !category || !brand || !description) {
    throw new Error('Thiếu thông tin bắt buộc: tên, danh mục, thương hiệu, mô tả')
  }

  const id = await generateUniqueProductId()

  const preferredSlug = toSlug(input.slug || name)
  const slug = await ensureUniqueProductSlug(preferredSlug)

  const bodyImages = normalizeStringArray(input.images)
  const bodyImagePublicIds = normalizeStringArray(input.imagePublicIds)
  const uploadedImageUrls = uploadedImageAssets.map((item) => item.url)
  const uploadedImagePublicIds = uploadedImageAssets.map((item) => item.publicId)
  const thumbnailImageIndex = parseNonNegativeInteger(input.thumbnailImageIndex)
  const selectedUploadedThumbnail =
    thumbnailImageIndex != null ? uploadedImageAssets[thumbnailImageIndex] || null : null

  const images = [...bodyImages, ...uploadedImageUrls].filter(Boolean)
  const imagePublicIds = [...bodyImagePublicIds, ...uploadedImagePublicIds].filter(Boolean)

  const thumbnail = String(
    uploadedThumbnail?.url || selectedUploadedThumbnail?.url || input.thumbnail || images[0] || name.toUpperCase(),
  ).trim()
  const thumbnailPublicId = String(
    uploadedThumbnail?.publicId || selectedUploadedThumbnail?.publicId || input.thumbnailPublicId || '',
  ).trim()
  const composedMedia = composeProductMedia({
    name,
    inputMedia: input.media,
    existingMedia: [],
    thumbnail,
    thumbnailPublicId,
    images,
    imagePublicIds,
  })

  const product = await Product.create({
    id,
    slug,
    name,
    description,
    category,
    brand,
    price: toPositiveNumber(input.price),
    oldPrice: input.oldPrice == null || input.oldPrice === '' ? null : toPositiveNumber(input.oldPrice),
    rating: toPositiveNumber(input.rating),
    stock: toPositiveNumber(input.stock),
    sold: toPositiveNumber(input.sold),
    thumbnail: composedMedia.thumbnail,
    thumbnailPublicId: composedMedia.thumbnailPublicId,
    media: composedMedia.media,
    images: composedMedia.images,
    imagePublicIds: composedMedia.imagePublicIds,
    specs: normalizeSpecs(input.specs),
    technicalDetails: String(input.technicalDetails || '').trim(),
    isFeatured: parseBooleanInput(input.isFeatured),
    isNew: parseBooleanInput(input.isNew),
  })

  return sanitizeDoc(product)
}

async function updateProductForAdmin(productId, payload, uploadedAssets = {}) {
  const input = payload && typeof payload === 'object' ? payload : {}
  const uploadedThumbnail = uploadedAssets?.thumbnail || null
  const uploadedImageAssets = normalizeAssetArray(uploadedAssets?.images)

  const product = await Product.findOne({ id: productId })
  if (!product) {
    throw new Error('Không tìm thấy sản phẩm để cập nhật')
  }

  const previousThumbnailPublicId = product.thumbnailPublicId
  const previousImagePublicIds = normalizeStringArray(product.imagePublicIds)
  const previousAllPublicIds = [previousThumbnailPublicId, ...previousImagePublicIds].filter(Boolean)
  const thumbnailImageIndex = parseNonNegativeInteger(input.thumbnailImageIndex)
  const selectedUploadedThumbnail =
    thumbnailImageIndex != null ? uploadedImageAssets[thumbnailImageIndex] || null : null

  if (input.name != null) {
    product.name = String(input.name).trim()
  }
  if (input.description != null) {
    product.description = String(input.description).trim()
  }
  if (input.category != null) {
    product.category = String(input.category).trim()
  }
  if (input.brand != null) {
    product.brand = String(input.brand).trim()
  }
  if (input.price != null) {
    product.price = toPositiveNumber(input.price)
  }
  if (input.oldPrice != null) {
    product.oldPrice = input.oldPrice === '' ? null : toPositiveNumber(input.oldPrice)
  }
  if (input.rating != null) {
    product.rating = toPositiveNumber(input.rating)
  }
  if (input.stock != null) {
    product.stock = toPositiveNumber(input.stock)
  }
  if (input.sold != null) {
    product.sold = toPositiveNumber(input.sold)
  }
  if (uploadedThumbnail) {
    product.thumbnail = String(uploadedThumbnail.url || '').trim()
    product.thumbnailPublicId = String(uploadedThumbnail.publicId || '').trim()
  } else if (selectedUploadedThumbnail) {
    product.thumbnail = String(selectedUploadedThumbnail.url || '').trim()
    product.thumbnailPublicId = String(selectedUploadedThumbnail.publicId || '').trim()
  } else {
    if (input.thumbnail != null) {
      product.thumbnail = String(input.thumbnail).trim()
    }

    if (input.thumbnailPublicId != null) {
      product.thumbnailPublicId = String(input.thumbnailPublicId).trim()
    }
  }

  const hasImagesInput = input.images != null
  if (hasImagesInput || uploadedImageAssets.length > 0) {
    const bodyImages = hasImagesInput ? normalizeStringArray(input.images) : normalizeStringArray(product.images)
    const uploadedImageUrls = uploadedImageAssets.map((item) => item.url)
    product.images = [...bodyImages, ...uploadedImageUrls].filter(Boolean)
  }

  const hasImagePublicIdsInput = input.imagePublicIds != null
  if (hasImagePublicIdsInput || uploadedImageAssets.length > 0) {
    const bodyImagePublicIds = hasImagePublicIdsInput
      ? normalizeStringArray(input.imagePublicIds)
      : normalizeStringArray(product.imagePublicIds)
    const uploadedImagePublicIds = uploadedImageAssets.map((item) => item.publicId)
    product.imagePublicIds = [...bodyImagePublicIds, ...uploadedImagePublicIds].filter(Boolean)
  }

  if (input.specs != null) {
    product.specs = normalizeSpecs(input.specs)
  }
  if (input.technicalDetails != null) {
    product.technicalDetails = String(input.technicalDetails).trim()
  }
  if (input.isFeatured != null) {
    product.isFeatured = parseBooleanInput(input.isFeatured)
  }
  if (input.isNew != null) {
    product.isNew = parseBooleanInput(input.isNew)
  }

  if (input.slug != null || input.name != null) {
    const preferredSlug = toSlug(input.slug || product.name)
    product.slug = await ensureUniqueProductSlug(preferredSlug, productId)
  }

  const composedMedia = composeProductMedia({
    name: product.name,
    inputMedia: input.media,
    existingMedia: product.media,
    thumbnail: product.thumbnail,
    thumbnailPublicId: product.thumbnailPublicId,
    images: product.images,
    imagePublicIds: product.imagePublicIds,
  })

  product.media = composedMedia.media
  product.thumbnail = composedMedia.thumbnail
  product.thumbnailPublicId = composedMedia.thumbnailPublicId
  product.images = composedMedia.images
  product.imagePublicIds = composedMedia.imagePublicIds

  await product.save()

  const nextThumbnailPublicId = String(product.thumbnailPublicId || '').trim()
  const nextImagePublicIds = normalizeStringArray(product.imagePublicIds)
  const nextAllPublicIds = [nextThumbnailPublicId, ...nextImagePublicIds].filter(Boolean)
  const removedPublicIds = previousAllPublicIds.filter(
    (publicId) => !nextAllPublicIds.includes(publicId),
  )

  if (removedPublicIds.length > 0) {
    await destroyImagesByPublicIds(removedPublicIds)
  }

  return sanitizeDoc(product)
}

async function deleteProductForAdmin(productId) {
  const deleted = await Product.findOneAndDelete({ id: productId })
  if (!deleted) {
    throw new Error('Không tìm thấy sản phẩm để xóa')
  }

  const publicIds = [
    deleted.thumbnailPublicId,
    ...normalizeStringArray(deleted.imagePublicIds),
    ...normalizeMediaInput(deleted.media, deleted.name).map((item) => item.publicId),
  ].filter(Boolean)

  const uniquePublicIds = [...new Set(publicIds)]
  if (uniquePublicIds.length > 0) {
    await destroyImagesByPublicIds(uniquePublicIds)
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

