const nodeGeocoder = require('node-geocoder')

const opsyen = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
}

const geocoder = nodeGeocoder(opsyen)

module.exports = geocoder
