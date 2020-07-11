const express = require('express')
const router = express.Router({ mergeParams: true })

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
  .post(ciptaKursus)

router.route('/:id').get(dapatkanKursus).put(updateKursus).delete(deleteKursus)

module.exports = router
