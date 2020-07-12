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

module.exports = mongoose.model('Review', SkimaReview)
