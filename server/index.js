// send_mail.js
const nodemailer = require("nodemailer");

// Gmailを使う場合（アプリパスワードを使うのが安全）
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kentarosuzuki1209@gmail.com",
    pass: "lvgnnhbyxcdptbqp",
  }
});

async function sendMail(to, subject, body) {
  const mailOptions = {
    from: "kentarosuzuki1209@gmail.com",
    to,
    subject,
    text: body,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ メール送信完了:", info.response);
  } catch (error) {
    console.error("❌ メール送信エラー:", error);
  }
}

// 動作テスト
sendMail(
  "masanobu827@gmail.com",
  "[災害用メールテスト]",
  "これはBさんの端末から送信されたメールです。"
);
