const User = require('../models/UserModel')
const { sanitizeDoc, sanitizeDocs } = require('../utils/mongoSanitize')
const { normalizePhone, validateFullName } = require('../utils/validation')

async function getUsers() {
  const users = await User.find().select('id fullName email role phone')
  return sanitizeDocs(users)
}

async function updateUser(userId, payload) {
  const input = payload && typeof payload === 'object' ? payload : {}
  const nextFullName = input.fullName == null ? null : validateFullName(input.fullName)
  const nextPhone = input.phone == null ? null : normalizePhone(input.phone)

  if (nextFullName == null && nextPhone == null) {
    const error = new Error('Không có dữ liệu hợp lệ để cập nhật')
    error.statusCode = 422
    throw error
  }

  const updatedUser = await User.findOneAndUpdate(
    { id: userId },
    {
      $set: {
        ...(nextFullName != null ? { fullName: nextFullName } : {}),
        ...(nextPhone != null ? { phone: nextPhone } : {}),
      },
    },
    { new: true, runValidators: true },
  ).select('id fullName email role phone')

  if (!updatedUser) {
    const error = new Error('Không tìm thấy người dùng')
    error.statusCode = 404
    throw error
  }

  return sanitizeDoc(updatedUser)
}

async function getUserById(userId) {
  const user = await User.findOne({ id: userId }).select('id fullName email role phone')
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
