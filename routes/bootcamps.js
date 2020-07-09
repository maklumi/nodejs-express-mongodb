const express = require('express')
const router = express.Router()

const {
  dapatkanSemuaBootcamps,
  dapatkanBootcampDenganId,
  ciptaBootcamp,
  updateBootcamp,
  deleteBootcamp,
} = require('../controllers/bootcamps')

router.route('/').get(dapatkanSemuaBootcamps).post(ciptaBootcamp)

router
  .route('/:id')
  .get(dapatkanBootcampDenganId)
  .put(updateBootcamp)
  .delete(deleteBootcamp)

module.exports = router
