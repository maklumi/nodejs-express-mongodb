const customErrorHandler = (err, req, res, next) => {
  console.log(err.stack.red)

  res.status(500).json({
    berjaya: false,
    mesej: err.message,
  })
}

module.exports = customErrorHandler
