class ResponseError extends Error {
  constructor(mesej, kodstatus) {
    super()
    this.message = mesej
    this.kodstatus = kodstatus
  }
}

module.exports = ResponseError
