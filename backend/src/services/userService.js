const User = require('../models/UserModel')
const { destroyImagesByPublicIds } = require('./cloudinaryService')
const { sanitizeDoc, sanitizeDocs } = require('../utils/mongoSanitize')
const { normalizePhone, validateFullName } = require('../utils/validation')

async function getUsers() {
  const users = await User.find().select('id fullName email role phone avatarUrl')
  return sanitizeDocs(users)
}

async function updateUser(userId, payload, options = {}) {
  const input = payload && typeof payload === 'object' ? payload : {}
  const avatar = options.avatar && typeof options.avatar === 'object' ? options.avatar : null
  const nextFullName = input.fullName == null ? null : validateFullName(input.fullName)
  const nextPhone = input.phone == null ? null : normalizePhone(input.phone)
  const nextAvatarUrl = avatar?.url ? String(avatar.url).trim() : ''
  const nextAvatarPublicId = avatar?.publicId ? String(avatar.publicId).trim() : ''

  if (nextFullName == null && nextPhone == null && !nextAvatarUrl) {
    const error = new Error('Không có dữ liệu hợp lệ để cập nhật')
    error.statusCode = 422
    throw error
  }

  const user = await User.findOne({ id: userId })
  if (!user) {
    const error = new Error('Không tìm thấy người dùng')
    error.statusCode = 404
    throw error
  }

  const previousAvatarPublicId = user.avatarPublicId

  if (nextFullName != null) {
    user.fullName = nextFullName
  }

  if (nextPhone != null) {
    user.phone = nextPhone
  }

  if (nextAvatarUrl) {
    user.avatarUrl = nextAvatarUrl
    user.avatarPublicId = nextAvatarPublicId
  }

  await user.save()

  if (nextAvatarUrl && previousAvatarPublicId && previousAvatarPublicId !== user.avatarPublicId) {
    await destroyImagesByPublicIds(previousAvatarPublicId)
  }

  return sanitizeDoc({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
  })
}

async function getUserById(userId) {
  const user = await User.findOne({ id: userId }).select('id fullName email role phone avatarUrl')
  if (!user) {
    const error = new Error('Không tìm thấy người dùng')
    error.statusCode = 404
    throw error
  }

  return sanitizeDoc(user)
}

module.exports = {
  getUsers,
  getUserById,
  updateUser,
}
