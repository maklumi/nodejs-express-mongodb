const express = require('express')
const router = express.Router()

// masukkan sekali router untuk resource lain
const routerKursus = require('./courses')

// re-route ke specific part
router.use('/:bootcampId/courses', routerKursus)

const {
  dapatkanSemuaBootcamps,
  dapatkanBootcampDenganId,
  ciptaBootcamp,
  updateBootcamp,
  deleteBootcamp,
  bootcampsDalamRadius,
  uploadFotoBootcamp,
} = require('../controllers/bootcamps')

router.route('/').get(dapatkanSemuaBootcamps).post(ciptaBootcamp)

router
  .route('/:id')
  .get(dapatkanBootcampDenganId)
  .put(updateBootcamp)
  .delete(deleteBootcamp)

router.route('/:id/foto').put(uploadFotoBootcamp)

router.route('/radius/:zipcode/:distance').get(bootcampsDalamRadius)

module.exports = router
