const ErrorResponse = require('../utils/resError')
const asyncHandler = require('../middeware/asyncHandler')
const User = require('../models/User')

// @desc    Daftar pengguna
// @route   POST /api/v1/auth/daftar
// @access  Public
exports.daftarPengguna = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body

  const pengguna = await User.create({ name, email, password, role })

  const token = pengguna.dapatJwtToken()

  res.status(200).json({
    berjaya: true,
    token,
  })
})
