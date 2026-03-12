const express = require('express')
const adminRoutes = require('./adminRoutes')
const authRoutes = require('./authRoutes')
const cartRoutes = require('./cartRoutes')
const categoryRoutes = require('./categoryRoutes')
const orderRoutes = require('./orderRoutes')
const productRoutes = require('./productRoutes')
const reviewRoutes = require('./reviewRoutes')
const userRoutes = require('./userRoutes')

const router = express.Router()

router.get('/health', (_req, res) => {
  res.status(200).json({ message: 'Homelyy API đang hoạt động' })
})

router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/categories', categoryRoutes)
router.use('/cart', cartRoutes)
router.use('/orders', orderRoutes)
router.use('/users', userRoutes)
router.use('/reviews', reviewRoutes)
router.use('/admin', adminRoutes)

module.exports = router
