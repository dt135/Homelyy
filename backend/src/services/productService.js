const Category = require('../models/CategoryModel')
const Product = require('../models/ProductModel')
const { sanitizeDoc, sanitizeDocs } = require('../utils/mongoSanitize')

function buildSort(sortKey) {
  switch (sortKey) {
    case 'price-asc':
      return { price: 1 }
    case 'price-desc':
      return { price: -1 }
    case 'newest':
      return { createdAt: -1 }
    case 'popular':
    default:
      return { sold: -1, rating: -1 }
  }
}

async function listProducts(query) {
  const search = (query.search || '').toLowerCase().trim()
  const category = query.category || ''
  const brand = query.brand || ''
  const minPrice = Number(query.minPrice || 0)
  const maxPrice = Number(query.maxPrice || 0)
  const limit = Number(query.limit || 0)
  const featuredOnly = String(query.featured || '').toLowerCase() === 'true'
  const newOnly = String(query.new || '').toLowerCase() === 'true'

  const filters = {}

  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
    ]
  }
  if (category) {
    filters.category = category
  }
  if (brand) {
    filters.brand = brand
  }
  if (minPrice > 0 || maxPrice > 0) {
    filters.price = {}
    if (minPrice > 0) {
      filters.price.$gte = minPrice
    }
    if (maxPrice > 0) {
      filters.price.$lte = maxPrice
    }
  }

  if (featuredOnly) {
    filters.isFeatured = true
  }

  if (newOnly) {
    filters.isNew = true
  }

  let productQuery = Product.find(filters).sort(buildSort(query.sort))
  if (limit > 0) {
    productQuery = productQuery.limit(limit)
  }

  const products = await productQuery
  return sanitizeDocs(products)
}

async function getProductById(productId) {
  const product = await Product.findOne({ id: productId })
  if (!product) {
    throw new Error('Không tìm thấy sản phẩm')
  }
  return sanitizeDoc(product)
}

async function listCategories() {
  const categories = await Category.find().sort({ name: 1 })
  return sanitizeDocs(categories)
}

module.exports = {
  listProducts,
  getProductById,
  listCategories,
}
