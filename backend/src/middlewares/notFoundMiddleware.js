function notFoundMiddleware(req, _res, next) {
  const error = new Error(`Không tìm thấy route: ${req.originalUrl}`)
  error.statusCode = 404
  next(error)
}

module.exports = notFoundMiddleware
