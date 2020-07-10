const ErrorResponse = require('../utils/resError')
const asyncHandler = require('../middeware/asyncHandler')
const geocoder = require('../utils/geocoder')
const Bootcamp = require('../models/Bootcamp')

// @desc    Dapatkan semua bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.dapatkanSemuaBootcamps = asyncHandler(async (req, res, next) => {
  let queryParametersString = JSON.stringify(req.query)

  queryParametersString = queryParametersString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (perkataan) => `$${perkataan}`,
  )

  // console.log(queryParametersString)
  // in postman, try /api/v1/bootcamps?averageCost[gte]=10000

  const bootcamps = await Bootcamp.find(JSON.parse(queryParametersString))
  res
    .status(200)
    .json({ berjaya: true, bilangan: bootcamps.length, data: bootcamps })
})

// @desc    Dapatkan satu bootcamp dengan id ini
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.dapatkanBootcampDenganId = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Tiada bootcamp dengan id ${req.params.id}`, 404),
    )
  }
  res.status(200).json({ berjaya: true, data: bootcamp })
})

// @desc    Cipta bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.ciptaBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body)
  // console.log(req.body)
  res.status(201).json({ berjaya: true, data: bootcamp })
})

// @desc    Update satu bootcamp dengan id ini
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!bootcamp) {
    return res.status(400).json({
      berjaya: false,
      mesej: `Tiada bootcamp dengan id ${req.params.id}`,
    })
  }
  res.status(200).json({ berjaya: true, data: bootcamp })
})

// tinggalkan kat bawah ni satu contoh kalau tak pakai asyncHandler
// @desc    Delete satu bootcamp dengan id ini
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    if (!bootcamp) {
      return res.status(400).json({
        berjaya: false,
        mesej: `Tiada bootcamp dengan id ${req.params.id}`,
      })
    }
    res.status(200).json({ berjaya: true, data: {} })
  } catch (err) {
    next(err)
  }
}

// @desc    Senarai bootcamp dalam lingkungan radius
// @route   GET request /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Public
exports.bootcampsDalamRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params

  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude
  const lng = loc[0].longitude

  const radiusdalamradian = distance / 3950

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radiusdalamradian] },
    },
  })

  res.status(200).json({
    berjaya: true,
    bilangan: bootcamps.length,
    data: bootcamps,
  })
})
