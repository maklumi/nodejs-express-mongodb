const express = require('express')
const dotenv = require('dotenv')
const sambunganDB = require('./config/db')

dotenv.config({ path: './config/config.env' })
// const logger = require('./middeware/logger')
const morgan = require('morgan')
sambunganDB()

const app = express()
const PORT = process.env.PORT || 5000

const bootcampRoutes = require('./routes/bootcamps')
// app.use(logger)
app.use(morgan('dev'))

app.use('/api/v1/bootcamps', bootcampRoutes)

const pelayan = app.listen(
  PORT,
  console.log(`Menerima di port ${PORT} dalam mode ${process.env.NODE_ENV}`),
)

process.on('unhandledRejection', (err, promise) => {
  console.log(`Ada error: ${err.message}`)

  pelayan.close(() => process.exit(1))
})
