const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const env = require('./config/env')
const errorMiddleware = require('./middlewares/errorMiddleware')
const notFoundMiddleware = require('./middlewares/notFoundMiddleware')
const routes = require('./routes')

const app = express()

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
)
app.use(express.json())
app.use(morgan('dev'))

app.use('/api', routes)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

module.exports = app
