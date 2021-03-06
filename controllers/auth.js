const crypto = require('crypto')
const ErrorResponse = require('../utils/resError')
const asyncHandler = require('../middeware/asyncHandler')
const hantarEmel = require('../utils/hantarEmel')
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

// @desc    Log out pengguna
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })

  res.status(200).json({
    berjaya: true,
    data: {},
  })
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

// @desc    Update details pengguna
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetailsPengguna = asyncHandler(async (req, res, next) => {
  const perkaraDiupdate = {
    name: req.body.name,
    email: req.body.email,
  }

  const pengguna = await User.findByIdAndUpdate(req.user.id, perkaraDiupdate, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    berjaya: true,
    data: pengguna,
  })
})

// @desc    Update password pengguna
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updatePasswordPengguna = asyncHandler(async (req, res, next) => {
  const pengguna = await User.findById(req.user.id).select('+password')

  if (!(await pengguna.padankanPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password salah', 401))
  }

  pengguna.password = req.body.newPassword
  await pengguna.save()

  sendTokenToCookie(pengguna, 200, res)
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

  // reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/auth/resetpassword/${resetToken}`

  const message = `Sila pergi ke ${resetUrl} untuk reset password`

  try {
    await hantarEmel({
      email: pengguna.email,
      subject: 'Password rese token',
      message,
    })

    res.status(200).json({
      berjaya: true,
      data: 'Email dihantar',
    })
  } catch (err) {
    console.log(err)
    pengguna.resetPasswordToken = undefined
    pengguna.resetPasswordExpire = undefined

    await pengguna.save({ validateBeforeSave: false })

    return next(new ErrorResponse('Tidak dapat hantar emel', 500))
  }
})

// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex')

  const pengguna = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  })

  if (!pengguna) {
    return next(new ErrorResponse('Token tak valid', 400))
  }

  // set password baru
  pengguna.password = req.body.password
  pengguna.resetPasswordToken = undefined
  pengguna.resetPasswordExpire = undefined
  await pengguna.save()

  sendTokenToCookie(pengguna, 200, res)
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
