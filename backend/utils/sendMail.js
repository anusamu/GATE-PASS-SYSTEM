require("dotenv").config();
const SibApiV3Sdk = require("sib-api-v3-sdk");

module.exports = async (recipients, subject, htmlContent) => {
  try {
    const client = SibApiV3Sdk.ApiClient.instance;

    // 🔑 API KEY
    client.authentications["api-key"].apiKey =
      process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    // ✅ Normalize recipients for Brevo
    const to = recipients
      .map((r) => {
        if (typeof r === "string") {
          return { email: r.trim() };
        }
        if (r && r.email) {
          return { email: r.email.trim() };
        }
        return null;
      })
      .filter(Boolean);

    if (!to.length) {
      throw new Error("No valid email recipients");
    }

    const emailData = {
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: "Gate Pass System",
      },
      to,
      subject,
      htmlContent,
    };

    await apiInstance.sendTransacEmail(emailData);

    console.log("✅ Email sent to:", to);
    return true;
  } catch (error) {
    console.error(
      "📧 Brevo API Error:",
      error.response?.body || error.message
    );
    throw new Error("Email could not be sent");
  }
};
