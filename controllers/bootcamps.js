const Bootcamp = require('../models/Bootcamp')

// @desc    Dapatkan semua bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.dapatkanSemuaBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find()
    res.status(200).json({ berjaya: true, data: bootcamps })
  } catch (err) {
    res.status(400).json({
      berjaya: false,
      mesej: 'Gagal dapatkan semua bootcamps' + err.message,
    })
  }
}

// @desc    Dapatkan satu bootcamp dengan id ini
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.dapatkanBootcampDenganId = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
      return res.status(400).json({
        berjaya: false,
        mesej: `Tiada bootcamp dengan id ${req.params.id}`,
      })
    }
    res.status(200).json({ berjaya: true, data: bootcamp })
  } catch (err) {
    res.status(400).json({
      berjaya: false,
      mesej: 'Gagal dapatkan bootcamp' + err.message,
    })
  }
}

// @desc    Cipta bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.ciptaBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body)
    // console.log(req.body)
    res.status(201).json({ berjaya: true, data: bootcamp })
  } catch (err) {
    res.status(400).json({ berjaya: false, mesej: err.message })
  }
}

// @desc    Update satu bootcamp dengan id ini
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ berjaya: true, mesej: `Update bootcamps id ${req.params.id}` })
}

// @desc    Delete satu bootcamp dengan id ini
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ berjaya: true, mesej: `Padam bootcamps id ${req.params.id}` })
}
