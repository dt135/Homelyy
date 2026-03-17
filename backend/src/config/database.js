const env = require('./env')
const mongoose = require('mongoose')

async function connectDatabase() {
  if (!env.mongodbUri) {
    throw new Error('Thiếu MONGODB_URI. Vui lòng cấu hình biến môi trường để kết nối MongoDB Atlas.')
  }

  await mongoose.connect(env.mongodbUri, {
    dbName: env.dbName,
  })

  return mongoose.connection.name
}

module.exports = { connectDatabase }
