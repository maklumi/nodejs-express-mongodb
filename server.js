const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const sambunganDB = require('./config/db')

// mesti load env variables dulu
dotenv.config({ path: './config/config.env' })

// sambungan ke mongo
sambunganDB()

const app = express()
const PORT = process.env.PORT || 5000

const bootcampRoutes = require('./routes/bootcamps')
// app.use(logger)
app.use(morgan('dev'))

app.use('/api/v1/bootcamps', bootcampRoutes)

const pelayan = app.listen(
  PORT,
  console.log(
    `Menerima di port ${PORT} dalam mode ${process.env.NODE_ENV}`.yellow.bold,
  ),
)

process.on('unhandledRejection', (err, promise) => {
  console.log(`Ada error: ${err.message}`.red)

  pelayan.close(() => process.exit(1))
})
