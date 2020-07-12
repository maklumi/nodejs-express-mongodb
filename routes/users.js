const express = require('express')
const {
  semuaUsers,
  satuUser,
  ciptaUser,
  updateUser,
  deleteUser,
} = require('../controllers/users')

const Pengguna = require('../models/User')

const advancedResults = require('../middeware/advancedResults')
const { protect, authorize } = require('../middeware/auth')

const router = express.Router()

router.use(protect)
router.use(authorize('admin'))

router.route('/').get(advancedResults(Pengguna), semuaUsers).post(ciptaUser)

router.route('/:id').get(satuUser).put(updateUser).delete(deleteUser)

module.exports = router
