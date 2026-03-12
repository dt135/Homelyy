const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  dbUri: process.env.DB_URI || 'mock://in-memory-db',
}

module.exports = env
