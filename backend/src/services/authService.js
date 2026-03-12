const User = require('../models/UserModel')
const { sanitizeDoc } = require('../utils/mongoSanitize')
const {
  normalizeEmail,
  normalizePhone,
  validateEmail,
  validateFullName,
  validatePassword,
} = require('../utils/validation')

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
  const input = payload && typeof payload === 'object' ? payload : {}
  const email = validateEmail(normalizeEmail(input.email))
  const password = String(input.password || '')

  if (!password) {
    throw new Error('Vui lòng nhập mật khẩu')
  }

  const foundUser = await User.findOne({ email })

  if (!foundUser || foundUser.password !== password) {
    const error = new Error('Email hoặc mật khẩu chưa đúng')
    error.statusCode = 401
    throw error
  }

  return sanitizeUser(sanitizeDoc(foundUser))
}

async function register(payload) {
  const input = payload && typeof payload === 'object' ? payload : {}
  const fullName = validateFullName(input.fullName)
  const email = validateEmail(normalizeEmail(input.email))
  const password = validatePassword(input.password)
  const phone = normalizePhone(input.phone)

  const existingUser = await User.findOne({ email }).select('id')
  if (existingUser) {
    const error = new Error('Email đã tồn tại')
    error.statusCode = 409
    throw error
  }

  const createdUser = await User.create({
    id: `user-${Date.now()}`,
    fullName,
    email,
    password,
    role: 'user',
    phone,
  })

  return sanitizeUser(sanitizeDoc(createdUser))
}

module.exports = {
  login,
  register,
}
