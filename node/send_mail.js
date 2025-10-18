const nodemailer = require("nodemailer");

// Fill these before running
const GMAIL_USER = "relay.demo@gmail.com";
const GMAIL_APP_PASSWORD = "YOUR_APP_PASSWORD_HERE"; // replace with app password

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'disaster.relay.demo@gmail.com',
    pass: 'GMAIL_APP_PASSWORD',
  },
});

async function sendMail(to, subject, text) {
  const mailOptions = {
    from: `Kentaro (Relay) <${GMAIL_USER}>`,
    to,
    subject,
    text,
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendMail };
