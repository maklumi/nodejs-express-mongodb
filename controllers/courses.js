const ErrorResponse = require('../utils/resError')
const asyncHandler = require('../middeware/asyncHandler')
const Course = require('../models/Course')

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
