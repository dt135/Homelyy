const User = require('../models/UserModel')
const { sanitizeDoc, sanitizeDocs } = require('../utils/mongoSanitize')

async function getUsers() {
  const users = await User.find().select('id fullName email role phone')
  return sanitizeDocs(users)
}

async function updateUser(userId, payload) {
  const updatedUser = await User.findOneAndUpdate(
    { id: userId },
    {
      $set: {
        ...(payload.fullName ? { fullName: payload.fullName } : {}),
        ...(payload.phone ? { phone: payload.phone } : {}),
      },
    },
    { new: true, runValidators: true },
  ).select('id fullName email role phone')

  if (!updatedUser) {
    throw new Error('Không tìm thấy người dùng')
  }

  return sanitizeDoc(updatedUser)
}

async function getUserById(userId) {
  const user = await User.findOne({ id: userId }).select('id fullName email role phone')
  if (!user) {
    throw new Error('Không tìm thấy người dùng')
  }

  return sanitizeDoc(user)
}

module.exports = {
  getUsers,
  getUserById,
  updateUser,
}
