const env = require('./env')

async function connectDatabase() {
  return Promise.resolve(`Connected to ${env.dbUri}`)
}

module.exports = { connectDatabase }
