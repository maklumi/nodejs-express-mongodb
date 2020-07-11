const express = require('express')
const router = express.Router({ mergeParams: true })
const { protect } = require('../middeware/auth')

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
  .post(protect, ciptaKursus)

router
  .route('/:id')
  .get(dapatkanKursus)
  .put(protect, updateKursus)
  .delete(protect, deleteKursus)

module.exports = router
