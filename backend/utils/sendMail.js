require("dotenv").config();
const SibApiV3Sdk = require("sib-api-v3-sdk");

module.exports = async (to, subject, html) => {
  try {
    const client = SibApiV3Sdk.ApiClient.instance;

    // Authenticate API Key
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const emailData = {
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: "Gate Pass System",
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    };

    await apiInstance.sendTransacEmail(emailData);
    return true;
  } catch (error) {
    console.error("📧 Brevo API Error:", error);
    throw new Error("Email could not be sent");
  }
};
