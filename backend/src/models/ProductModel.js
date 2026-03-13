const mongoose = require('mongoose')

const productMediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, default: '' },
    alt: { type: String, default: '' },
    position: { type: Number, default: 0, min: 0 },
    isPrimary: { type: Boolean, default: false },
  },
  {
    _id: false,
  },
)

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, default: null, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    stock: { type: Number, default: 0, min: 0 },
    sold: { type: Number, default: 0, min: 0 },
    thumbnail: { type: String, required: true, trim: true },
    thumbnailPublicId: { type: String, default: '' },
    media: { type: [productMediaSchema], default: [] },
    images: { type: [String], default: [] },
    imagePublicIds: { type: [String], default: [] },
    specs: {
      type: Map,
      of: String,
      default: {},
    },
    isFeatured: { type: Boolean, default: false, index: true },
    isNew: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  },
)

module.exports = mongoose.model('Product', productSchema)
