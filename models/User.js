const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const SkimaPengguna = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sila beri nama'],
    maxlength: [50, 'Nama kena bawah 50 karakter'],
  },
  email: {
    type: String,
    required: [true, 'Sila beri emel'],
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Sila guna emel yang valid',
    ],
  },
  role: {
    type: String,
    enum: ['user', 'publisher'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'sila tambah password'],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// encrypt password sebelum save. Bila create kita dapat capai contentnya
SkimaPengguna.pre('save', async function (next) {
  const garam = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, garam)
})

// sign jwt
const jwt = require('jsonwebtoken')
SkimaPengguna.methods.dapatJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_RAHSIA, {
    expiresIn: process.env.JWT_TAMAT_TEMPOH,
  })
}

// periksa password
SkimaPengguna.methods.padankanPassword = async function (katalaluan) {
  return await bcrypt.compare(katalaluan, this.password)
}

module.exports = mongoose.model('User', SkimaPengguna)
