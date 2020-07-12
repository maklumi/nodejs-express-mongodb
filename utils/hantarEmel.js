const nodemailer = require('nodemailer')

const hantarEmel = async (opsen) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  let info = await transporter.sendMail({
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: opsen.email,
    subject: opsen.subject,
    text: opsen.message,
  })

  console.log('Message sent: %s', info.messageId)
}

module.exports = hantarEmel
