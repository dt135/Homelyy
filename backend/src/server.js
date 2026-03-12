const app = require('./app')
const { connectDatabase } = require('./config/database')
const env = require('./config/env')

async function bootstrap() {
  const connectedDbName = await connectDatabase()
  console.log(`Đã kết nối MongoDB Atlas: ${connectedDbName}`)
  app.listen(env.port, () => {
    console.log(`Backend Homelyy đang chạy tại http://localhost:${env.port}`)
  })
}

bootstrap().catch((error) => {
  console.error('Khởi động server thất bại', error)
  process.exit(1)
})
