const ErrorResponse = require('../utils/resError')
const asyncHandler = require('../middeware/asyncHandler')
const User = require('../models/User')

// @desc    Daftar pengguna
// @route   POST /api/v1/auth/daftar
// @access  Public
exports.daftarPengguna = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body

  const pengguna = await User.create({ name, email, password, role })

  sendTokenToCookie(pengguna, 200, res)
})

// @desc    Daftar pengguna
// @route   POST /api/v1/auth/login
// @access  Public
exports.loginPengguna = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  // validate dulu
  if (!email || !password) {
    return next(new ErrorResponse('Sila masukkan email dan password', 400))
  }

  // tengok ada tak
  const pengguna = await User.findOne({ email }).select('+password')

  if (!pengguna) {
    return next(new ErrorResponse('invalid email dan password', 401))
  }

  // tengok sama tak password
  const padan = await pengguna.padankanPassword(password)

  if (!padan) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }

  sendTokenToCookie(pengguna, 200, res)
})

// @desc    Dapatkan pengguna sekarang
// @route   POST /api/v1/auth/me
// @access  Private
exports.siapaSaya = asyncHandler(async (req, res, next) => {
  const pengguna = await User.findById(req.user.id)

  res.status(200).json({
    berjaya: true,
    data: pengguna,
  })
})

// @desc    Lupa password
// @route   POST /api/v1/auth/lupapassword
// @access  Public
exports.lupaPassword = asyncHandler(async (req, res, next) => {
  const pengguna = await User.findOne({ email: req.body.email })

  if (!pengguna) {
    return next(
      new ErrorResponse(`Tiada pengguna dengan emel ${req.body.email}`, 404),
    )
  }

  const resetToken = pengguna.buatResetPasswordToken()

  await pengguna.save({ validateBeforeSave: false })

  res.status(200).json({
    berjaya: true,
    data: pengguna,
  })
})

const sendTokenToCookie = (user, statusCode, res) => {
  const token = user.dapatJwtToken()

  const opsyen = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  }

  if (process.env.NODE_ENV === 'production') {
    opsyen.secure = true
  }

  res.status(statusCode).cookie('token', token, opsyen).json({
    berjaya: true,
    token,
  })
}
