const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const customErrorHandler = require('./middeware/customerror')
const sambunganDB = require('./config/db')
const fileupload = require('express-fileupload')
const cookieparser = require('cookie-parser')
const sanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xssclean = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')

// mesti load env variables dulu
dotenv.config({ path: './config/config.env' })

// sambungan ke mongo
sambunganDB()

const app = express()
// guna body parser supaya boleh req.body
app.use(express.json())
app.use(cookieparser())

const PORT = process.env.PORT || 5000

const bootcampRoutes = require('./routes/bootcamps')
const kursusRoutes = require('./routes/courses')
const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/users')
const reviewsRoutes = require('./routes/reviews')

// app.use(logger)
app.use(morgan('dev'))

// upload file guna middleware
app.use(fileupload())

// sanitize data
app.use(sanitize())
// secure headers
app.use(helmet())
// prevent scripting xss
app.use(xssclean())
// rate limit request
const limiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 100 })
app.use(limiter)
// prevent http param pollution
app.use(hpp())
// enable cors
app.use(cors())

// buat static folder di public
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/v1/bootcamps', bootcampRoutes)
app.use('/api/v1/courses', kursusRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', adminRoutes)
app.use('/api/v1/reviews', reviewsRoutes)

app.use(customErrorHandler)

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
