const express = require('express')
const orderController = require('../controllers/orderController')
const { requireAuth } = require('../middlewares/authMiddleware')

const router = express.Router()

router.use(requireAuth)

router.get('/', orderController.getOrders)
router.post('/', orderController.createOrder)

module.exports = router
