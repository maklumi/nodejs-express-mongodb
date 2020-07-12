const mongoose = require('mongoose')
const slugify = require('slugify')
const geocoder = require('../utils/geocoder')

const skimaBootcamp = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: [50, 'Nama kena bawah 50 karakter'],
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Sila bubuh sedikit keterangan'],
      maxlength: [500, 'Jangan lebih 500 karakter'],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Sila guna URL yang ada HTTP/S',
      ],
    },
    phone: {
      type: String,
      maxlength: [20, 'Nombor talipon terlebih panjang dari 20'],
    },
    email: {
      type: String,
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Sila guna emel yang valid',
      ],
    },
    address: {
      type: String,
      required: [true, 'Sila tambah alamat'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      type: [String],
      required: true,
      enum: [
        'Web Development',
        'Mobile Development',
        'UI/UX',
        'Data Science',
        'Business',
        'Other',
      ],
    },
    averageRating: {
      type: Number,
      min: [1, 'Rate antara 1 dan 10'],
      max: [10, 'Rate antara 1 dan 10'],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: 'no-photo.jpg',
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

skimaBootcamp.pre('save', function (callnextmiddleware) {
  // console.log('guna slugify ', slugify(this.name))
  this.slug = slugify(this.name, { lower: true })
  callnextmiddleware()
})

skimaBootcamp.pre('save', async function (next) {
  const lokasi = await geocoder.geocode(this.address)
  this.location = {
    type: 'Point',
    coordinates: [lokasi[0].longitude, lokasi[0].latitude],
    formattedAddress: lokasi[0].formattedAddress,
    street: lokasi[0].streetName,
    city: lokasi[0].city,
    state: lokasi[0].stateCode,
    zipcode: lokasi[0].zipcode,
    country: lokasi[0].countryCode,
  }
  // save except this address because we got location above already
  this.address = undefined
  next()
})

// populate tapi dengan virtual saja, tak persistent
skimaBootcamp.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false,
})

// jika bootcamp padam, kursus juga padam
skimaBootcamp.pre('remove', async function (next) {
  console.log(`Kursus dipadam dari bootcamp id ${this._id}`)
  await this.model('Course').deleteMany({ bootcamp: this._id })
  next()
})

module.exports = mongoose.model('Bootcamp', skimaBootcamp)
