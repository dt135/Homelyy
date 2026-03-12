const authService = require('../services/authService')

function login(req, res, next) {
  try {
    const user = authService.login(req.body)
    return res.status(200).json({ message: 'Đăng nhập thành công', data: user })
  } catch (error) {
    return next(error)
  }
}

function register(req, res, next) {
  try {
    const user = authService.register(req.body)
    return res.status(201).json({ message: 'Đăng ký thành công', data: user })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  login,
  register,
}
