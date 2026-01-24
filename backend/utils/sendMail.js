require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // Brevo uses STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
});

// Verify SMTP
transporter.verify((error) => {
  if (error) {
    console.error("❌ Brevo Mail Error:", error);
  } else {
    console.log("✅ Brevo Mail Server is ready");
  }
});

module.exports = async (to, subject, html) => {
  try {
    return await transporter.sendMail({
      from: `"Gate Pass System" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("📧 Brevo Send Error:", error);
    throw new Error("Email could not be sent");
  }
};
