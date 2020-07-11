const express = require('express')
const { daftarPengguna, loginPengguna } = require('../controllers/auth')

const router = express.Router()

router.post('/login', loginPengguna)
router.post('/daftar', daftarPengguna)

module.exports = router
