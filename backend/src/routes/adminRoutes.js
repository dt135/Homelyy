const express = require('express')
const adminController = require('../controllers/adminController')
const { requireAdmin, requireAuth } = require('../middlewares/authMiddleware')
const { uploadProductImages } = require('../middlewares/uploadMiddleware')

const router = express.Router()

router.use(requireAuth, requireAdmin)

router.get('/dashboard', adminController.getDashboard)
router.get('/categories', adminController.getCategoryManagement)
router.post('/categories', adminController.createCategory)
router.patch('/categories/:id', adminController.updateCategory)
router.delete('/categories/:id', adminController.deleteCategory)
router.get('/products', adminController.getProductManagement)
router.post('/products', uploadProductImages, adminController.createProduct)
router.patch('/products/:id', uploadProductImages, adminController.updateProduct)
router.delete('/products/:id', adminController.deleteProduct)
router.get('/orders', adminController.getOrderManagement)
router.patch('/orders/:id', adminController.updateOrder)
router.delete('/orders/:id', adminController.deleteOrder)
router.get('/users', adminController.getUserManagement)
router.post('/users', adminController.createUser)
router.patch('/users/:id', adminController.updateUser)
router.delete('/users/:id', adminController.deleteUser)

module.exports = router
