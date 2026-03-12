const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongodbUri: process.env.MONGODB_URI || '',
  dbName: process.env.DB_NAME || 'homelyy',
  autoSeed: (process.env.AUTO_SEED || 'true').toLowerCase() !== 'false',
  jwtSecret: process.env.JWT_SECRET || 'homelyy-dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
}

module.exports = env
