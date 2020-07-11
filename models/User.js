const mongoose = require('mongoose')

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

module.exports = mongoose.model('User', SkimaPengguna)
