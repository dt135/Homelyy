const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, default: 0, min: 0 },
  },
  {
    _id: false,
  },
)

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: '' },
    phone: { type: String, default: '' },
    city: { type: String, default: '' },
    district: { type: String, default: '' },
    addressLine: { type: String, default: '' },
  },
  {
    _id: false,
  },
)

const orderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    items: { type: [orderItemSchema], required: true },
    paymentMethod: { type: String, enum: ['cod', 'banking'], default: 'cod' },
    shippingAddress: { type: shippingAddressSchema, default: () => ({}) },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed'],
      default: 'pending',
      index: true,
    },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: false,
  },
)

module.exports = mongoose.model('Order', orderSchema)
