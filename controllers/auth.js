const ErrorResponse = require('../utils/resError')
const asyncHandler = require('../middeware/asyncHandler')
const User = require('../models/User')

// @desc    Daftar pengguna
// @route   GET /api/v1/auth/daftar
// @access  Public
exports.daftarPengguna = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    berjaya: true,
  })
})
