const express = require('express')
const {
  daftarPengguna,
  loginPengguna,
  siapaSaya,
  lupaPassword,
  resetPassword,
} = require('../controllers/auth')

const { protect } = require('../middeware/auth')

const router = express.Router()

router.post('/login', loginPengguna)
router.post('/daftar', daftarPengguna)
router.post('/lupapassword', lupaPassword)
router.get('/me', protect, siapaSaya)
router.put('/resetpassword/:resettoken', resetPassword)

module.exports = router
