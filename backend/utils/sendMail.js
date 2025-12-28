require('dotenv').config(); // Ensure variables are loaded
const nodemailer = require("nodemailer");

// 1. Create the transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// 2. Verify the connection configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mail Server Error:", error);
  } else {
    console.log("✅ Mail Server is ready to send messages");
  }
});

// 3. Export the function with error handling
module.exports = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Gate Pass System" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
    
    console.log("📧 Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("📧 Mail Send Error:", error);
    // Throw error or return false so the controller knows it failed
    throw new Error("Email could not be sent");
  }
};