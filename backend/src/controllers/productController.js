const productService = require('../services/productService')

async function getProducts(req, res, next) {
  try {
    const products = await productService.listProducts(req.query)
    return res.status(200).json({ message: 'Lấy danh sách sản phẩm thành công', data: products })
  } catch (error) {
    return next(error)
  }
}

async function getProductDetail(req, res, next) {
  try {
    const product = await productService.getProductById(req.params.id)
    return res.status(200).json({ message: 'Lấy chi tiết sản phẩm thành công', data: product })
  } catch (error) {
    return next(error)
  }
}

async function getCategories(_req, res, next) {
  try {
    const categories = await productService.listCategories()
    return res.status(200).json({ message: 'Lấy danh mục thành công', data: categories })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getProducts,
  getProductDetail,
  getCategories,
}
