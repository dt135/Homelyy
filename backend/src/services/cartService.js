const cartsByUser = new Map()

function getCart(userId) {
  return cartsByUser.get(userId) || []
}

function updateCart(userId, items) {
  cartsByUser.set(userId, items)
  return getCart(userId)
}

module.exports = {
  getCart,
  updateCart,
}
