const express = require('express')
const router = express.Router({ mergeParams: true })

const {
  dapatkanSemuaKursus,
  dapatkanKursus,
  ciptaKursus,
  updateKursus,
  deleteKursus,
} = require('../controllers/courses')

router.route('/').get(dapatkanSemuaKursus).post(ciptaKursus)
router.route('/:id').get(dapatkanKursus).put(updateKursus).delete(deleteKursus)

module.exports = router
