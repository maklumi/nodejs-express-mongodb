const express = require('express')
const router = express.Router()

const {
  dapatkanSemuaBootcamps,
  dapatkanBootcampDenganId,
  ciptaBootcamp,
  updateBootcamp,
  deleteBootcamp,
  bootcampsDalamRadius,
} = require('../controllers/bootcamps')

router.route('/').get(dapatkanSemuaBootcamps).post(ciptaBootcamp)

router
  .route('/:id')
  .get(dapatkanBootcampDenganId)
  .put(updateBootcamp)
  .delete(deleteBootcamp)

router.route('/radius/:zipcode/:distance').get(bootcampsDalamRadius)

module.exports = router
