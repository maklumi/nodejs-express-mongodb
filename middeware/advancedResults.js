const { populate } = require('../models/Course')

const advancedResults = (model, populate) => async (req, res, next) => {
  const copyOfReqQuery = { ...req.query }

  const bahagianTakPerlu = ['pilih', 'susunan', 'halaman', 'had']
  bahagianTakPerlu.forEach((field) => delete copyOfReqQuery[field])

  let queryParametersString = JSON.stringify(copyOfReqQuery)

  queryParametersString = queryParametersString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (perkataan) => `$${perkataan}`,
  )

  // in postman, try /api/v1/bootcamps?averageCost[gte]=10000

  let resources = model.find(JSON.parse(queryParametersString))

  // ?pilih=name,description
  if (req.query.pilih) {
    const pilihan = req.query.pilih.split(',').join(' ')
    console.log(pilihan)
    resources = resources.select(pilihan)
  }

  // ?..&susunan=name
  if (req.query.susunan) {
    const susunString = req.query.susunan.split(',').join(' ')
    resources = resources.sort(susunString)
  } else {
    resources = resources.sort('-createdAt') // descending order
  }

  // ?halaman=2&had=3
  const halaman = parseInt(req.query.halaman, 10) || 1
  const had = parseInt(req.query.had, 10) || 100
  const indeksMula = (halaman - 1) * had
  const indeksAkhir = halaman * had

  resources = resources.skip(indeksMula).limit(had)

  // tambah 'laman ke depan' dan 'laman ke belakang'
  const mukasurat = {}

  if (indeksMula > 0) {
    mukasurat.kebelakang = {
      halaman: halaman - 1,
      had: had,
    }
  }

  const jumlahDokumen = await model.estimatedDocumentCount()
  if (indeksAkhir < jumlahDokumen) {
    mukasurat.kedepan = {
      halaman: halaman + 1,
      had: had,
    }
  }

  if (populate) {
    resources = resources.populate(populate)
  }

  const data = await resources

  res.advancedResults = {
    berjaya: true,
    bilangan: data.length,
    mukasurat,
    data: data,
  }

  next()
}

module.exports = advancedResults
