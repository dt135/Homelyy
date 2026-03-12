const Review = require('../models/ReviewModel')
const { sanitizeDoc, sanitizeDocs } = require('../utils/mongoSanitize')

async function listReviews(productId) {
  const filters = {}
  if (productId) {
    filters.productId = productId
  }
  const reviews = await Review.find(filters).sort({ createdAt: -1 })
  return sanitizeDocs(reviews)
}

async function createReview(payload) {
  const review = await Review.create({
    id: `RV-${Date.now()}`,
    userId: payload.userId,
    productId: payload.productId,
    rating: payload.rating,
    comment: payload.comment,
    createdAt: new Date(),
  })
  return sanitizeDoc(review)
}

module.exports = {
  listReviews,
  createReview,
}
