const ErrorResponse = require('../utils/resError')
const asyncHandler = require('../middeware/asyncHandler')
const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamp')

// @desc    Dapatkan semua courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.dapatkanSemuaKursus = asyncHandler(async (req, res, next) => {
  let resources

  if (req.params.bootcampId) {
    resources = Course.find({ bootcamp: req.params.bootcampId })
  } else {
    resources = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    })
  }

  const courses = await resources

  res.status(200).json({
    berjaya: true,
    bilangan: courses.length,
    data: courses,
  })
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
// @route   GET /api/v1/bootcamps/:id/courses
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
