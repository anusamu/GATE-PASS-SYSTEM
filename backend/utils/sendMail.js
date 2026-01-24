require("dotenv").config();
const nodemailer = require("nodemailer");

// 1️⃣ Create transporter (Render-safe)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // MUST be false for 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // Gmail App Password
  },
  connectionTimeout: 10000, // optional but helpful
  greetingTimeout: 10000,
});

// 2️⃣ Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mail Server Error:", error);
  } else {
    console.log("✅ Mail Server is ready to send messages");
  }
});

// 3️⃣ Send mail function
module.exports = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Gate Pass System" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("📧 Mail Send Error:", error);
    throw new Error("Email could not be sent");
  }
};
