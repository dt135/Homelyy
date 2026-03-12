const adminService = require('../services/adminService')
const { destroyImagesByPublicIds } = require('../services/cloudinaryService')

function getUploadedProductAssets(files) {
  const thumbnailFile = files?.thumbnail?.[0]
  const imageFiles = Array.isArray(files?.images) ? files.images : []

  return {
    thumbnail: thumbnailFile
      ? {
          url: thumbnailFile.path,
          publicId: thumbnailFile.filename,
        }
      : null,
    images: imageFiles.map((file) => ({
      url: file.path,
      publicId: file.filename,
    })),
  }
}

async function cleanupUploadedProductAssets(files) {
  const { thumbnail, images } = getUploadedProductAssets(files)
  const publicIds = [thumbnail?.publicId, ...images.map((item) => item.publicId)].filter(Boolean)
  if (publicIds.length > 0) {
    await destroyImagesByPublicIds(publicIds)
  }
}

async function getDashboard(_req, res, next) {
  try {
    const stats = await adminService.getDashboardStats()
    return res.status(200).json({ message: 'Lấy thống kê quản trị thành công', data: stats })
  } catch (error) {
    return next(error)
  }
}

async function getCategoryManagement(_req, res, next) {
  try {
    const categories = await adminService.getCategoriesForAdmin()
    return res.status(200).json({ message: 'Lấy danh sách danh mục quản trị thành công', data: categories })
  } catch (error) {
    return next(error)
  }
}

async function getProductManagement(_req, res, next) {
  try {
    const products = await adminService.getProductsForAdmin()
    return res.status(200).json({ message: 'Lấy danh sách sản phẩm quản trị thành công', data: products })
  } catch (error) {
    return next(error)
  }
}

async function getOrderManagement(_req, res, next) {
  try {
    const orders = await adminService.getOrdersForAdmin()
    return res.status(200).json({ message: 'Lấy danh sách đơn hàng quản trị thành công', data: orders })
  } catch (error) {
    return next(error)
  }
}

async function getUserManagement(_req, res, next) {
  try {
    const users = await adminService.getUsersForAdmin()
    return res.status(200).json({ message: 'Lấy danh sách người dùng quản trị thành công', data: users })
  } catch (error) {
    return next(error)
  }
}

async function createCategory(req, res, next) {
  try {
    const createdCategory = await adminService.createCategoryForAdmin(req.body)
    return res.status(201).json({ message: 'Tạo danh mục thành công', data: createdCategory })
  } catch (error) {
    return next(error)
  }
}

async function updateCategory(req, res, next) {
  try {
    const updatedCategory = await adminService.updateCategoryForAdmin(req.params.id, req.body)
    return res.status(200).json({ message: 'Cập nhật danh mục thành công', data: updatedCategory })
  } catch (error) {
    return next(error)
  }
}

async function deleteCategory(req, res, next) {
  try {
    const deletedCategory = await adminService.deleteCategoryForAdmin(req.params.id)
    return res.status(200).json({ message: 'Xóa danh mục thành công', data: deletedCategory })
  } catch (error) {
    return next(error)
  }
}

async function createProduct(req, res, next) {
  try {
    const assets = getUploadedProductAssets(req.files)
    const createdProduct = await adminService.createProductForAdmin(req.body, assets)
    return res.status(201).json({ message: 'Tạo sản phẩm thành công', data: createdProduct })
  } catch (error) {
    await cleanupUploadedProductAssets(req.files)
    return next(error)
  }
}

async function updateProduct(req, res, next) {
  try {
    const assets = getUploadedProductAssets(req.files)
    const updatedProduct = await adminService.updateProductForAdmin(req.params.id, req.body, assets)
    return res.status(200).json({ message: 'Cập nhật sản phẩm thành công', data: updatedProduct })
  } catch (error) {
    await cleanupUploadedProductAssets(req.files)
    return next(error)
  }
}

async function deleteProduct(req, res, next) {
  try {
    const deletedProduct = await adminService.deleteProductForAdmin(req.params.id)
    return res.status(200).json({ message: 'Xóa sản phẩm thành công', data: deletedProduct })
  } catch (error) {
    return next(error)
  }
}

async function updateOrder(req, res, next) {
  try {
    const updatedOrder = await adminService.updateOrderForAdmin(req.params.id, req.body)
    return res.status(200).json({ message: 'Cập nhật đơn hàng thành công', data: updatedOrder })
  } catch (error) {
    return next(error)
  }
}

async function deleteOrder(req, res, next) {
  try {
    const deletedOrder = await adminService.deleteOrderForAdmin(req.params.id)
    return res.status(200).json({ message: 'Xóa đơn hàng thành công', data: deletedOrder })
  } catch (error) {
    return next(error)
  }
}

async function createUser(req, res, next) {
  try {
    const createdUser = await adminService.createUserForAdmin(req.body)
    return res.status(201).json({ message: 'Tạo người dùng thành công', data: createdUser })
  } catch (error) {
    return next(error)
  }
}

async function updateUser(req, res, next) {
  try {
    const updatedUser = await adminService.updateUserForAdmin(req.params.id, req.body, req.authUser.id)
    return res.status(200).json({ message: 'Cập nhật người dùng thành công', data: updatedUser })
  } catch (error) {
    return next(error)
  }
}

async function deleteUser(req, res, next) {
  try {
    const deletedUser = await adminService.deleteUserForAdmin(req.params.id, req.authUser.id)
    return res.status(200).json({ message: 'Xóa người dùng thành công', data: deletedUser })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getDashboard,
  getCategoryManagement,
  getProductManagement,
  getOrderManagement,
  getUserManagement,
  createCategory,
  updateCategory,
  deleteCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  createUser,
  updateUser,
  deleteUser,
  updateOrder,
  deleteOrder,
}
