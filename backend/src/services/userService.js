const { users } = require('../models/mockDb')

function getUsers() {
  return users.map((user) => ({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  }))
}

function updateUser(userId, payload) {
  const index = users.findIndex((user) => user.id === userId)
  if (index === -1) {
    throw new Error('Không tìm thấy người dùng')
  }

  users[index] = {
    ...users[index],
    fullName: payload.fullName || users[index].fullName,
    phone: payload.phone || users[index].phone,
  }

  const updatedUser = users[index]
  return {
    id: updatedUser.id,
    fullName: updatedUser.fullName,
    email: updatedUser.email,
    role: updatedUser.role,
    phone: updatedUser.phone,
  }
}

function getUserById(userId) {
  const found = users.find((user) => user.id === userId)
  if (!found) {
    throw new Error('Không tìm thấy người dùng')
  }

  return {
    id: found.id,
    fullName: found.fullName,
    email: found.email,
    role: found.role,
  }
}

module.exports = {
  getUsers,
  getUserById,
  updateUser,
}
