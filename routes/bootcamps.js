const express = require('express')
const router = express.Router()
const { protect, authorize } = require('../middeware/auth')

// masukkan sekali router untuk resource lain
const routerKursus = require('./courses')
const routerReview = require('./reviews')

// re-route ke specific part
router.use('/:bootcampId/courses', routerKursus)
router.use('/:bootcampId/reviews', routerReview)

const {
  dapatkanSemuaBootcamps,
  dapatkanBootcampDenganId,
  ciptaBootcamp,
  updateBootcamp,
  deleteBootcamp,
  bootcampsDalamRadius,
  uploadFotoBootcamp,
} = require('../controllers/bootcamps')

const Bootcamp = require('../models/Bootcamp')
const advancedResults = require('../middeware/advancedResults')

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), dapatkanSemuaBootcamps)
  .post(protect, ciptaBootcamp)

router
  .route('/:id')
  .get(dapatkanBootcampDenganId)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp)

router
  .route('/:id/foto')
  .put(protect, authorize('publisher', 'admin'), uploadFotoBootcamp)

router.route('/radius/:zipcode/:distance').get(bootcampsDalamRadius)

module.exports = router
