const mongoose = require('mongoose')

const sambunganDB = async () => {
  const conn = await mongoose.connect(process.env.URI_MONGO, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })

  console.log(`MongoDB bersambung: ${conn.connection.host}`.cyan.underline.bold)
}

module.exports = sambunganDB
