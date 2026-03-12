const express = require('express')
const adminController = require('../controllers/adminController')
const { requireAdmin, requireAuth } = require('../middlewares/authMiddleware')

const router = express.Router()

router.use(requireAuth, requireAdmin)

router.get('/dashboard', adminController.getDashboard)
router.get('/categories', adminController.getCategoryManagement)
router.post('/categories', adminController.createCategory)
router.patch('/categories/:id', adminController.updateCategory)
router.delete('/categories/:id', adminController.deleteCategory)
router.get('/products', adminController.getProductManagement)
router.post('/products', adminController.createProduct)
router.patch('/products/:id', adminController.updateProduct)
router.delete('/products/:id', adminController.deleteProduct)
router.get('/orders', adminController.getOrderManagement)
router.patch('/orders/:id', adminController.updateOrder)
router.delete('/orders/:id', adminController.deleteOrder)

module.exports = router
