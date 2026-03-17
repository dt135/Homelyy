const mongoose = require('mongoose')
const env = require('../config/env')
const { seedDatabase } = require('./seedDatabase')

async function runSeed() {
  if (!env.mongodbUri) {
    throw new Error('Thiếu MONGODB_URI. Không thể seed database.')
  }

  await mongoose.connect(env.mongodbUri, {
    dbName: env.dbName,
  })

  await seedDatabase()
  console.log('Seed dữ liệu MongoDB thành công')
  await mongoose.disconnect()
}

runSeed().catch((error) => {
  console.error('Seed dữ liệu thất bại', error)
  process.exit(1)
})
