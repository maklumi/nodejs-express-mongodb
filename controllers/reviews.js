const ErrorResponse = require('../utils/resError')
const asyncHandler = require('../middeware/asyncHandler')
const Review = require('../models/Review')
const Bootcamp = require('../models/Bootcamp')

// @desc    Dapatkan semua reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const resources = await Review.find({ bootcamp: req.params.bootcampId })
    return res.status(200).json({
      berjaya: true,
      bilangan: resources.length,
      data: resources,
    })
  } else {
    res.status(200).json(res.advancedResults)
  }
})
