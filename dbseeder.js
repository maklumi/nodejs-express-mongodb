const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

// load env variables dulu
dotenv.config({ path: './config/config.env' })

// load models
const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')
const Pengguna = require('./models/User')

// connect to db
mongoose.connect(process.env.URI_MONGO, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})

// baca json files
const docs = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'),
)
const dokumenKursus = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'),
)
const dokumenPenguna = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'),
)

// masukkan dalam db
const masukdata = async () => {
  try {
    await Bootcamp.create(docs)
    await Course.create(dokumenKursus)
    await Pengguna.create(dokumenPenguna)
    console.log('Data sudah dimasukkan...'.green.inverse)
    process.exit()
  } catch (error) {
    console.log(err)
  }
}

// padam apa dalam db
const padamdata = async () => {
  try {
    await Bootcamp.deleteMany()
    await Course.deleteMany()
    await Pengguna.deleteMany()
    console.log('Data sudah dipadam'.red.inverse)
    process.exit()
  } catch (error) {
    console.log(err)
  }
}

// prompt$ node dbseeder [-i|-d] untuk fungsi di bawah
if (process.argv[2] === '-i') {
  masukdata()
} else if (process.argv[2] === '-d') {
  padamdata()
}
