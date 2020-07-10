const ErrorResponse = require('../utils/resError')

const customErrorHandler = (err, req, res, next) => {
  let error = err

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = new ErrorResponse(`Tiada bahan dengan id ${err.value}`, 404)
    console.log(error)
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error = new ErrorResponse(`Sudah ada entri yang sama nama`, 400)
  }

  // Mongoose validation issue
  if (err.name === 'ValidationError') {
    const mesej = Object.values(err.errors).map((item) => item.message)
    error = new ErrorResponse(mesej, 400)
  }

  res.status(error.kodstatus || 500).json({
    berjaya: false,
    mesej: error.message || 'Ada error',
  })
}

module.exports = customErrorHandler
