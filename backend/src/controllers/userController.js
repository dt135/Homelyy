const userService = require('../services/userService')

function getUsers(_req, res, next) {
  try {
    const users = userService.getUsers()
    return res.status(200).json({ message: 'Lấy danh sách người dùng thành công', data: users })
  } catch (error) {
    return next(error)
  }
}

function getUserDetail(req, res, next) {
  try {
    const user = userService.getUserById(req.params.id)
    return res.status(200).json({ message: 'Lấy thông tin người dùng thành công', data: user })
  } catch (error) {
    return next(error)
  }
}

function updateUser(req, res, next) {
  try {
    const user = userService.updateUser(req.params.id, req.body)
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
