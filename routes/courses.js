const express = require('express')
const router = express.Router({ mergeParams: true })

const {
  dapatkanSemuaKursus,
  dapatkanKursus,
  ciptaKursus,
} = require('../controllers/courses')

router.route('/').get(dapatkanSemuaKursus).post(ciptaKursus)
router.route('/:id').get(dapatkanKursus)

module.exports = router
