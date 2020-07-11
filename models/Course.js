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

SkimaKursus.statics.hargaPurataKursus = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        hargaPurata: { $avg: '$tuition' },
      },
    },
  ])

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].hargaPurata / 10) * 10,
    })
  } catch (err) {
    console.log(err)
  }
}

// kira harga lepas saving
SkimaKursus.post('save', function () {
  this.constructor.hargaPurataKursus(this.bootcamp)
})

// kira harga sebelum padam
SkimaKursus.pre('remove', function () {
  this.constructor.hargaPurataKursus(this.bootcamp)
})

module.exports = mongoose.model('Course', SkimaKursus)
