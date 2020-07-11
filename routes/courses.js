const express = require('express')
const router = express.Router({ mergeParams: true })

const { dapatkanSemuaKursus } = require('../controllers/courses')

router.route('/').get(dapatkanSemuaKursus)

module.exports = router
