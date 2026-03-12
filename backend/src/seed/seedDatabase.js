const Category = require('../models/CategoryModel')
const Order = require('../models/OrderModel')
const Product = require('../models/ProductModel')
const Review = require('../models/ReviewModel')
const User = require('../models/UserModel')
const seedData = require('./seedData')

async function upsertById(Model, payload) {
  if (payload.length === 0) {
    return
  }

  const operations = payload.map((item) => ({
    updateOne: {
      filter: { id: item.id },
      update: { $set: item },
      upsert: true,
    },
  }))

  await Model.bulkWrite(operations)
}

async function seedCollectionIfEmpty(Model, payload) {
  const total = await Model.countDocuments()
  if (total > 0) {
    return
  }
  if (payload.length === 0) {
    return
  }
  await Model.insertMany(payload)
}

async function seedDatabase() {
  await upsertById(User, seedData.users)
  await upsertById(Category, seedData.categories)
  await upsertById(Product, seedData.products)
  await seedCollectionIfEmpty(Order, seedData.orders)
  await seedCollectionIfEmpty(Review, seedData.reviews)
}

module.exports = {
  seedDatabase,
}
