const express = require('express')
const { daftarPengguna } = require('../controllers/auth')

const router = express.Router()

router.post('/daftar', daftarPengguna)

module.exports = router
