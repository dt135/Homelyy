const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const env = require('./config/env')
const errorMiddleware = require('./middlewares/errorMiddleware')
const notFoundMiddleware = require('./middlewares/notFoundMiddleware')
const routes = require('./routes')

const app = express()
const allowedOrigins = Array.from(new Set([env.clientUrl, ...env.corsAllowedOrigins].filter(Boolean)))

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`))
    },
    credentials: true,
  }),
)
app.use(express.json())
app.use(morgan('dev'))

app.use('/api', routes)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

module.exports = app
