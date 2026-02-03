require("dotenv").config();
const SibApiV3Sdk = require("sib-api-v3-sdk");

module.exports = async (
  recipients,        // TO
  subject,
  htmlContent,
  ccRecipients = []  // ✅ CC (optional)
) => {
  try {
    const client = SibApiV3Sdk.ApiClient.instance;

    // 🔑 Brevo API Key
    client.authentications["api-key"].apiKey =
      process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    // ✅ Normalize TO recipients
    const to = recipients
      .map(r =>
        typeof r === "string"
          ? { email: r.trim() }
          : r?.email
          ? { email: r.email.trim() }
          : null
      )
      .filter(Boolean);

    if (!to.length) {
      throw new Error("No valid TO email recipients");
    }

    // ✅ Normalize CC recipients
    const cc = ccRecipients
      .map(r =>
        typeof r === "string"
          ? { email: r.trim() }
          : r?.email
          ? { email: r.email.trim() }
          : null
      )
      .filter(Boolean);

    const emailData = {
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: "Gate Pass System",
      },
      to,
      subject,
      htmlContent,
      ...(cc.length && { cc }) // ✅ add cc only if exists
    };

    await apiInstance.sendTransacEmail(emailData);

    console.log("✅ Email sent");
    console.log("TO:", to);
    if (cc.length) console.log("CC:", cc);

    return true;
  } catch (error) {
    console.error(
      "📧 Brevo API Error:",
      error.response?.body || error.message
    );
    throw new Error("Email could not be sent");
  }
};
