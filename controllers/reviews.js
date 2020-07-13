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

// @desc    Dapatkan satu review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  })

  if (!review) {
    return next(
      new ErrorResponse(`Tiada review dengan id ${req.params.id}`, 404),
    )
  }
  res.status(200).json({
    berjaya: true,
    data: review,
  })
})

// @desc    Buat review
// @route   POST /api/v1/bootcamps/:bootcampId/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId
  req.body.user = req.user.id

  const bootcamp = await Bootcamp.findById(req.params.bootcampId)

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Tiada bootcamp dengan id ${req.params.bootcampId}`,
        404,
      ),
    )
  }

  const review = await Review.create(req.body)

  res.status(201).json({
    berjaya: true,
    data: review,
  })
})

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id)

  if (!review) {
    return next(
      new ErrorResponse(`Tiada review dengan id ${req.params.id}`, 404),
    )
  }

  // pastikan review user punya dan user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Tiada otoriti untuk update`, 401))
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(201).json({
    berjaya: true,
    data: review,
  })
})

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)

  if (!review) {
    return next(
      new ErrorResponse(`Tiada review dengan id ${req.params.id}`, 404),
    )
  }

  // pastikan review user punya dan user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Tiada otoriti untuk delete`, 401))
  }

  await review.remove()

  res.status(201).json({
    berjaya: true,
    data: {},
  })
})
