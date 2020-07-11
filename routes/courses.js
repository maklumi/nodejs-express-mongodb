const express = require('express')
const router = express.Router({ mergeParams: true })
const { protect, authorize } = require('../middeware/auth')

const {
  dapatkanSemuaKursus,
  dapatkanKursus,
  ciptaKursus,
  updateKursus,
  deleteKursus,
} = require('../controllers/courses')

const Kursus = require('../models/Course')
const advancedResults = require('../middeware/advancedResults')

router
  .route('/')
  .get(
    advancedResults(Kursus, {
      path: 'bootcamp',
      select: 'name description',
    }),
    dapatkanSemuaKursus,
  )
  .post(protect, authorize('publisher', 'admin'), ciptaKursus)

router
  .route('/:id')
  .get(dapatkanKursus)
  .put(protect, authorize('publisher', 'admin'), updateKursus)
  .delete(protect, authorize('publisher', 'admin'), deleteKursus)

module.exports = router
