const authService = require('../services/authService')
const { signAccessToken } = require('../utils/jwt')

async function login(req, res, next) {
  try {
    const user = await authService.login(req.body)
    const token = signAccessToken({ id: user.id, role: user.role, email: user.email })
    return res.status(200).json({
      message: 'Đăng nhập thành công',
      data: {
        user,
        token,
      },
    })
  } catch (error) {
    return next(error)
  }
}

async function register(req, res, next) {
  try {
    const user = await authService.register(req.body)
    const token = signAccessToken({ id: user.id, role: user.role, email: user.email })
    return res.status(201).json({
      message: 'Đăng ký thành công',
      data: {
        user,
        token,
      },
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  login,
  register,
}
