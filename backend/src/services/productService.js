const { products, categories } = require('../models/mockDb')

function listProducts(query) {
  const search = (query.search || '').toLowerCase().trim()
  const category = query.category || ''
  const brand = query.brand || ''

  return products.filter((product) => {
    const matchesSearch =
      !search || product.name.toLowerCase().includes(search) || product.category.toLowerCase().includes(search)
    const matchesCategory = !category || product.category === category
    const matchesBrand = !brand || product.brand === brand

    return matchesSearch && matchesCategory && matchesBrand
  })
}

function getProductById(productId) {
  const product = products.find((item) => item.id === productId)
  if (!product) {
    throw new Error('Không tìm thấy sản phẩm')
  }
  return product
}

function listCategories() {
  return categories
}

module.exports = {
  listProducts,
  getProductById,
  listCategories,
}
