const mongoose = require('mongoose')

const SkimaReview = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Sila letak tajuk'],
    maxLength: 100,
  },
  text: {
    type: String,
    required: [true, 'Sila bagi teks'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Rating antara 1 dan 10'],
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
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
})

// Hanya boleh buat satu review untuk satu bootcamp
SkimaReview.index({ bootcamp: 1, user: 1 }, { unique: true })

SkimaReview.statics.purataRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        purataRating: { $avg: '$rating' },
      },
    },
  ])

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      purataRating: obj[0].purataRating,
    })
  } catch (err) {
    console.log(err)
  }
}

// kira purata rating lepas saving
SkimaReview.post('save', function () {
  this.constructor.purataRating(this.bootcamp)
})

// kira purata rating sebelum padam
SkimaReview.pre('remove', function () {
  this.constructor.purataRating(this.bootcamp)
})

module.exports = mongoose.model('Review', SkimaReview)
