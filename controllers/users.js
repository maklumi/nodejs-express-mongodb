const crypto = require('crypto')
const ErrorResponse = require('../utils/resError')
const asyncHandler = require('../middeware/asyncHandler')
const User = require('../models/User')

// @desc    Dapatkan semua pengguna
// @route   GET /api/v1/auth/users
// @access  Private/Admin
exports.semuaUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc    Dapatkan satu pengguna
// @route   GET /api/v1/auth/users/:id
// @access  Private/Admin
exports.satuUser = asyncHandler(async (req, res, next) => {
  const pengguna = await User.findById(req.params.id)
  res.status(200).json({
    berjaya: true,
    data: pengguna,
  })
})

// @desc    Cipta pengguna
// @route   POST /api/v1/auth/users
// @access  Private/Admin
exports.ciptaUser = asyncHandler(async (req, res, next) => {
  const pengguna = await User.create(req.body)

  res.status(200).json({
    berjaya: true,
    data: pengguna,
  })
})

// @desc    Update pengguna
// @route   PUT /api/v1/auth/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const pengguna = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    berjaya: true,
    data: pengguna,
  })
})

// @desc    Delete pengguna
// @route   DELETE /api/v1/auth/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id)

  res.status(200).json({
    berjaya: true,
    data: {},
  })
})
