const { verifyAccessToken } = require('../utils/jwt')

function extractToken(authorizationHeader) {
  if (!authorizationHeader) {
    return null
  }

  const [scheme, token] = authorizationHeader.split(' ')
  if (scheme !== 'Bearer' || !token) {
    return null
  }

  return token
}

function requireAuth(req, _res, next) {
  try {
    const token = extractToken(req.headers.authorization)
    if (!token) {
      const error = new Error('Bạn chưa đăng nhập hoặc token không hợp lệ')
      error.statusCode = 401
      throw error
    }

    const payload = verifyAccessToken(token)
    req.authUser = {
      id: payload.id,
      role: payload.role,
      email: payload.email,
    }

    return next()
  } catch (_error) {
    const error = new Error('Phiên đăng nhập hết hạn hoặc token không hợp lệ')
    error.statusCode = 401
    return next(error)
  }
}

function requireAdmin(req, _res, next) {
  if (!req.authUser || req.authUser.role !== 'admin') {
    const error = new Error('Bạn không có quyền truy cập tài nguyên quản trị')
    error.statusCode = 403
    return next(error)
  }

  return next()
}

module.exports = {
  requireAuth,
  requireAdmin,
}
