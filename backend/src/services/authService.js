const User = require('../models/UserModel')
const { sanitizeDoc } = require('../utils/mongoSanitize')
const { hashPassword, isPasswordHash, verifyPassword } = require('../utils/password')
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
    avatarUrl: user.avatarUrl,
  }
}

async function login(payload) {
  const input = payload && typeof payload === 'object' ? payload : {}
  const email = validateEmail(normalizeEmail(input.email))
  const password = String(input.password || '')

  if (!password) {
    throw new Error('Vui long nhap mat khau')
  }

  const foundUser = await User.findOne({ email })

  if (!foundUser || !verifyPassword(password, foundUser.password)) {
    const error = new Error('Email hoac mat khau chua dung')
    error.statusCode = 401
    throw error
  }

  if (!isPasswordHash(foundUser.password)) {
    foundUser.password = hashPassword(password)
    await foundUser.save()
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
    const error = new Error('Email da ton tai')
    error.statusCode = 409
    throw error
  }

  const createdUser = await User.create({
    id: `user-${Date.now()}`,
    fullName,
    email,
    password: hashPassword(password),
    role: 'user',
    phone,
    avatarUrl: '',
    avatarPublicId: '',
  })

  return sanitizeUser(sanitizeDoc(createdUser))
}

module.exports = {
  login,
  register,
}
