const { reviews } = require('../models/mockDb')

function listReviews(productId) {
  return reviews.filter((review) => review.productId === productId)
}

function createReview(payload) {
  const review = {
    id: `RV-${Date.now()}`,
    userId: payload.userId,
    productId: payload.productId,
    rating: payload.rating,
    comment: payload.comment,
    createdAt: new Date().toISOString(),
  }
  reviews.push(review)
  return review
}

module.exports = {
  listReviews,
  createReview,
}
