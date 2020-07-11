const ErrorResponse = require('../utils/resError')
const asyncHandler = require('../middeware/asyncHandler')
const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamp')

// @desc    Dapatkan semua courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.dapatkanSemuaKursus = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const resources = await Course.find({ bootcamp: req.params.bootcampId })
    return res.status(200).json({
      berjaya: true,
      bilangan: resources.length,
      data: resources,
    })
  } else {
    res.status(200).json(res.advancedResults)
  }
})

// @desc    Dapatkan kursus guna id
// @route   GET /api/v1/courses/:id
// @access  Public
exports.dapatkanKursus = asyncHandler(async (req, res, next) => {
  const kursus = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  })

  if (!kursus) {
    return next(
      new ErrorResponse(`Tiada kursus dengan id ${req.params.id}`, 404),
    )
  }

  res.status(200).json({
    berjaya: true,
    data: kursus,
  })
})

// @desc    cipta kursus dalam bootcamp guna id bootcamp
// @route   POST /api/v1/bootcamps/:id/courses
// @access  Private - hanya yang authenticate boleh cipta
exports.ciptaKursus = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId

  const bootcamp = await Bootcamp.findById(req.params.bootcampId)

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Tiada bootcamp dengan id ${req.params.bootcampId}`,
        404,
      ),
    )
  }

  const kursus = await Course.create(req.body)

  res.status(200).json({
    berjaya: true,
    data: kursus,
  })
})

// @desc    update kursus
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateKursus = asyncHandler(async (req, res, next) => {
  let kursus = await Course.findById(req.params.id)

  if (!kursus) {
    return next(
      new ErrorResponse(`Tiada kursus dengan id ${req.params.id}`, 404),
    )
  }

  kursus = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  res.status(200).json({
    berjaya: true,
    data: kursus,
  })
})

// @desc    delete kursus
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.deleteKursus = asyncHandler(async (req, res, next) => {
  const kursus = await Course.findById(req.params.id)

  if (!kursus) {
    return next(
      new ErrorResponse(`Tiada kursus dengan id ${req.params.id}`, 404),
    )
  }

  await kursus.remove()

  res.status(200).json({
    berjaya: true,
    data: {},
  })
})
