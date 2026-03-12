const express = require('express')
const userController = require('../controllers/userController')

const router = express.Router()

router.get('/', userController.getUsers)
router.get('/:id', userController.getUserDetail)
router.patch('/:id', userController.updateUser)

module.exports = router
