const { users } = require('../models/mockDb')

function sanitizeUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  }
}

function login(payload) {
  const foundUser = users.find(
    (user) => user.email.toLowerCase() === payload.email.toLowerCase() && user.password === payload.password,
  )

  if (!foundUser) {
    throw new Error('Email hoặc mật khẩu chưa đúng')
  }

  return sanitizeUser(foundUser)
}

function register(payload) {
  const emailExists = users.some((user) => user.email.toLowerCase() === payload.email.toLowerCase())
  if (emailExists) {
    throw new Error('Email đã tồn tại')
  }

  const newUser = {
    id: `user-${Date.now()}`,
    fullName: payload.fullName,
    email: payload.email,
    password: payload.password,
    role: 'user',
  }

  users.push(newUser)
  return sanitizeUser(newUser)
}

module.exports = {
  login,
  register,
}
