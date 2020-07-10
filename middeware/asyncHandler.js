const asyncHandler = (fungsi) => (req, res, next) =>
  Promise.resolve(fungsi(req, res, next)).catch(next)

module.exports = asyncHandler
