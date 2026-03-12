const express = require('express')
const adminController = require('../controllers/adminController')

const router = express.Router()

router.get('/dashboard', adminController.getDashboard)
router.get('/products', adminController.getProductManagement)
router.get('/orders', adminController.getOrderManagement)

module.exports = router
