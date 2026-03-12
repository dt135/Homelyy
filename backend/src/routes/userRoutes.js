const express = require('express')
const userController = require('../controllers/userController')
const { requireAdmin, requireAuth } = require('../middlewares/authMiddleware')

const router = express.Router()

router.use(requireAuth)

router.get('/', requireAdmin, userController.getUsers)
router.get('/:id', userController.getUserDetail)
router.patch('/:id', userController.updateUser)

module.exports = router
