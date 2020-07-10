const mongoose = require('mongoose')

const SkimaKursus = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Sila letak tajuk'],
  },
  description: {
    type: String,
    required: [true, 'Sila letak keterangan'],
  },
  weeks: {
    type: String,
    required: [true, 'Sila letak berapa minggu'],
  },
  tuition: {
    type: Number,
    required: [true, 'Sila letak harga tuisyen'],
  },
  minimumSkill: {
    type: String,
    required: [true, ' Sila letak skil paling rendah diperlukan'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  scholarshipsAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
})

module.exports = mongoose.model('Course', SkimaKursus)
