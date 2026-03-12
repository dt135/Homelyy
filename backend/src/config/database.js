const env = require('./env')
const mongoose = require('mongoose')
const { seedDatabase } = require('../seed/seedDatabase')

async function connectDatabase() {
  if (!env.mongodbUri) {
    throw new Error('Thiếu MONGODB_URI. Vui lòng cấu hình biến môi trường để kết nối MongoDB Atlas.')
  }

  await mongoose.connect(env.mongodbUri, {
    dbName: env.dbName,
  })

  if (env.autoSeed) {
    await seedDatabase()
  }

  return mongoose.connection.name
}

module.exports = { connectDatabase }
