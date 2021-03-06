const express = require('express')
const {
  daftarPengguna,
  loginPengguna,
  siapaSaya,
  lupaPassword,
  resetPassword,
  updateDetailsPengguna,
  updatePasswordPengguna,
  logout,
} = require('../controllers/auth')

const { protect } = require('../middeware/auth')

const router = express.Router()

router.post('/login', loginPengguna)
router.post('/daftar', daftarPengguna)
router.post('/lupapassword', lupaPassword)
router.get('/me', protect, siapaSaya)
router.get('/logout', protect, logout)
router.put('/resetpassword/:resettoken', resetPassword)
router.put('/updatedetails', protect, updateDetailsPengguna)
router.put('/updatepassword', protect, updatePasswordPengguna)

module.exports = router
