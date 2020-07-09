// @desc    Dapatkan semua bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.dapatkanSemuaBootcamps = (req, res, next) => {
  res.status(200).json({ berjaya: true, mesej: 'Dapatkan semua bootcamps' })
}

// @desc    Dapatkan satu bootcamp dengan id ini
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.dapatkanBootcampDenganId = (req, res, next) => {
  res
    .status(200)
    .json({ berjaya: true, mesej: `Dapatkan bootcamps id ${req.params.id}` })
}

// @desc    Cipta bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.ciptaBootcamp = (req, res, next) => {
  res.status(200).json({ berjaya: true, mesej: 'Cipta satu bootcamp' })
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
