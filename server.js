const express = require('express')
const dotenv = require('dotenv')

dotenv.config({ path: './config/config.env' })

const app = express()
const PORT = process.env.PORT || 5000

const bootcampRoutes = require('./routes/bootcamps')
app.use('/api/v1/bootcamps', bootcampRoutes)

app.listen(
  PORT,
  console.log(`Menerima di port ${PORT} dalam mode ${process.env.NODE_ENV}`),
)
