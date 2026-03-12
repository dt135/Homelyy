const User = require('../models/UserModel')
const { sanitizeDoc } = require('../utils/mongoSanitize')

function sanitizeUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    phone: user.phone,
  }
}

async function login(payload) {
  const email = String(payload.email || '').trim().toLowerCase()
  const password = String(payload.password || '')

  const foundUser = await User.findOne({ email })

  if (!foundUser || foundUser.password !== password) {
    throw new Error('Email hoặc mật khẩu chưa đúng')
  }

  return sanitizeUser(sanitizeDoc(foundUser))
}

async function register(payload) {
  const email = String(payload.email || '').trim().toLowerCase()
  const existingUser = await User.findOne({ email }).select('id')
  if (existingUser) {
    throw new Error('Email đã tồn tại')
  }

  const createdUser = await User.create({
    id: `user-${Date.now()}`,
    fullName: payload.fullName,
    email,
    password: payload.password,
    role: 'user',
  })

  return sanitizeUser(sanitizeDoc(createdUser))
}

module.exports = {
  login,
  register,
}
