const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, unique: true, trim: true },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Category', categorySchema)
