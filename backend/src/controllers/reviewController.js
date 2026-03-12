const reviewService = require('../services/reviewService')

function getReviews(req, res, next) {
  try {
    const reviews = reviewService.listReviews(req.query.productId)
    return res.status(200).json({ message: 'Lấy đánh giá thành công', data: reviews })
  } catch (error) {
    return next(error)
  }
}

function createReview(req, res, next) {
  try {
    const review = reviewService.createReview(req.body)
    return res.status(201).json({ message: 'Tạo đánh giá thành công', data: review })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getReviews,
  createReview,
}
