const express = require('express')
const cartController = require('../controllers/cartController')
const { requireAuth } = require('../middlewares/authMiddleware')

const router = express.Router()

router.use(requireAuth)
router.get('/', cartController.getCart)
router.put('/', cartController.updateCart)

module.exports = router
