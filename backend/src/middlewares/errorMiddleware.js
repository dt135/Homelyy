function errorMiddleware(error, _req, res, _next) {
  const statusCode = error.statusCode || 400

  return res.status(statusCode).json({
    message: error.message || 'Lỗi máy chủ không mong muốn',
  })
}

module.exports = errorMiddleware
