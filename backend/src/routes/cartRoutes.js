const express = require('express')
const cartController = require('../controllers/cartController')

const router = express.Router()

router.get('/', cartController.getCart)
router.put('/', cartController.updateCart)

module.exports = router
