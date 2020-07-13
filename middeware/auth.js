const jwt = require('jsonwebtoken')
const asyncHandler = require('./asyncHandler')
const ErrorResponse = require('../utils/resError')
const User = require('../models/User')

// routes yg kena protect
exports.protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.token) {
    // use what is already in cookie
    token = req.cookies.token
  }

  if (!token) {
    return next(new ErrorResponse('Tiada otoriti', 401))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_RAHSIA)

    console.log(decoded)

    req.user = await User.findById(decoded.id)

    next()
  } catch (err) {
    return next(new ErrorResponse('Tiada otoriti', 401))
  }
})

// Beri akses kepada role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `Role ${req.user.role} Tiada otoriti untuk route ini`,
          403,
        ),
      )
    }
    next()
  }
}
