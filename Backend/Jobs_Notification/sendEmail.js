const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendEmail(to, subject, html) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

module.exports = sendEmail;
