const userService = require('../services/userService')

function ensureSelfOrAdmin(authUser, targetUserId) {
  if (!authUser || (authUser.role !== 'admin' && authUser.id !== targetUserId)) {
    const error = new Error('Bạn không có quyền thao tác với người dùng này')
    error.statusCode = 403
    throw error
  }
}

async function getUsers(_req, res, next) {
  try {
    const users = await userService.getUsers()
    return res.status(200).json({ message: 'Lấy danh sách người dùng thành công', data: users })
  } catch (error) {
    return next(error)
  }
}

async function getUserDetail(req, res, next) {
  try {
    ensureSelfOrAdmin(req.authUser, req.params.id)
    const user = await userService.getUserById(req.params.id)
    return res.status(200).json({ message: 'Lấy thông tin người dùng thành công', data: user })
  } catch (error) {
    return next(error)
  }
}

async function updateUser(req, res, next) {
  try {
    ensureSelfOrAdmin(req.authUser, req.params.id)
    const user = await userService.updateUser(req.params.id, req.body)
    return res.status(200).json({ message: 'Cập nhật người dùng thành công', data: user })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getUsers,
  getUserDetail,
  updateUser,
}
