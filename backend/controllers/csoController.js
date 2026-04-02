const Pass = require("../models/Pass");
const User = require("../models/User");
const sendMail = require("../utils/sendMail");
const mongoose = require("mongoose");
const generatePassPDF = require("../utils/generatePassPDF");
const path = require("path");
const fs = require("fs");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");

/* ===============================
   EMAIL VALIDATION
================================ */

const isValidEmail = (email) =>
  typeof email === "string" &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const buildRecipients = (...emails) =>
  emails
    .map((e) => e?.trim())
    .filter(isValidEmail)
    .map((email) => ({ email }));


/* =====================================================
   CSO VIEW ALL PENDING PASSES
===================================================== */

exports.getAllPendingPasses = async (req, res) => {
  try {

    if (req.user.role !== "cso") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const passes = await Pass.find({
      status: "PENDING",
    }).sort({ createdAt: -1 });

    res.json(passes);

  } catch (error) {
    console.error("CSO PENDING ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};



/* =====================================================
   CSO APPROVE PASS
===================================================== */

exports.approvePassByCso = async (req, res) => {
  try {

    const { id } = req.params;

    if (req.user.role !== "cso") {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Pass ID" });
    }

    const pass = await Pass.findById(id);

    if (!pass) {
      return res.status(404).json({ message: "Pass not found" });
    }

    if (pass.status !== "PENDING") {
      return res.status(400).json({ message: `Already ${pass.status}` });
    }

    /* ===== GENERATE QR ===== */

    if (!pass.qrCode) {

      const uniqueCode = uuidv4();

      pass.qrCode = uniqueCode;

      const qrImage = await QRCode.toDataURL(uniqueCode);

      pass.qrImage = qrImage;
    }

    pass.status = "APPROVED";
    pass.used = false;
    pass.approvedBy = "CSO";
    pass.approvedAt = new Date();

    await pass.save();

    /* ===== SEND EMAIL ===== */

    const recipients = buildRecipients(
      pass.requesterEmail,
      pass.externalPersonEmail
    );

    if (recipients.length) {

      sendMail(
        recipients,
       "Gate Pass Approved by CSO",
`
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; padding: 40px 10px; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #048cedff 0%, #09f097ff 100%); padding: 30px; text-align: center;">
      <img 
        src="https://gate-pass-system-kappa.vercel.app/tp-logo.png"
        alt="Technopark"
        style="width:180px; filter:brightness(0) invert(1);"
      />
    </div>

    <!-- Body -->
    <div style="padding: 40px 30px;">
      <h2 style="color: #333; margin-top: 0; font-size: 24px; font-weight: 800;">
        Gate Pass Approved ✅
      </h2>

      <p style="color: #555; font-size: 16px;">Hello,</p>

      <p style="color: #555; font-size: 16px;">
        Your gate pass request has been <strong style="color: green;">approved</strong> by the Chief Security Officer.
      </p>

      <!-- Details Box -->
      <div style="background-color: #f8fafb; border-radius: 8px; padding: 20px; border-left: 4px solid #28a745; margin: 25px 0;">
        <p style="margin: 5px 0; font-size: 15px; color: #333;">
          <strong>Asset:</strong> ${pass.assetName}
        </p>
        <p style="margin: 5px 0; font-size: 15px; color: #333;">
          <strong>Serial No:</strong> ${pass.assetSerialNo}
        </p>
      </div>

      <p style="color: #555; font-size: 14px;">
        You can view your approved gate pass using the button below.
      </p>

      <!-- Button -->
      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.BACKEND_URL}/pass/view/${pass._id}" 
           style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
                  color: white; 
                  padding: 14px 32px; 
                  text-decoration: none; 
                  border-radius: 6px; 
                  font-weight: bold; 
                  display: inline-block;
                  box-shadow: 0 4px 10px rgba(40,167,69,0.3);">
          View Gate Pass
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
      This is an automated notification from the Technopark Gate Pass System.
    </div>
  </div>
</div>
`
      ).catch(console.error);
    }

    res.json({
      message: "Gate pass approved by CSO",
      pass,
    });

  } catch (error) {
    console.error("CSO APPROVE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};



/* =====================================================
   CSO REJECT PASS
===================================================== */

exports.rejectPassByCso = async (req, res) => {
  try {

    const { id } = req.params;
    const { reason } = req.body;

    if (req.user.role !== "cso") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const pass = await Pass.findById(id);

    if (!pass) {
      return res.status(404).json({ message: "Pass not found" });
    }

    pass.status = "REJECTED";
    pass.rejectionReason = reason || "Rejected by CSO";
    pass.rejectedBy = "CSO";
    pass.rejectedAt = new Date();

    await pass.save();

    const recipients = buildRecipients(
      pass.requesterEmail,
      pass.externalPersonEmail
    );

    if (recipients.length) {

      sendMail(
        recipients,
       "Gate Pass Rejected by CSO",
`
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; padding: 40px 10px; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #ff4d4d 0%, #ff7b7b 100%); padding: 30px; text-align: center;">
      <img 
        src="https://gate-pass-system-kappa.vercel.app/tp-logo.png"
        alt="Technopark"
        style="width:180px; filter:brightness(0) invert(1);"
      />
    </div>

    <!-- Body -->
    <div style="padding: 40px 30px;">
      <h2 style="color: #333; margin-top: 0; font-size: 24px; font-weight: 800;">
        Gate Pass Rejected ❌
      </h2>

      <p style="color: #555; font-size: 16px;">Hello,</p>

      <p style="color: #555; font-size: 16px;">
        Your gate pass request has been <strong style="color: #dc3545;">rejected</strong> by the Chief Security Officer.
      </p>

      <!-- Details Box -->
      <div style="background-color: #f8fafb; border-radius: 8px; padding: 20px; border-left: 4px solid #dc3545; margin: 25px 0;">
        <p style="margin: 5px 0; font-size: 15px; color: #333;">
          <strong>Asset:</strong> ${pass.assetName}
        </p>
        <p style="margin: 5px 0; font-size: 15px; color: #333;">
          <strong>Reason:</strong> ${pass.rejectionReason}
        </p>
      </div>

      <p style="color: #555; font-size: 14px;">
        If you believe this was a mistake or need further clarification, please contact the administration team.
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
      This is an automated notification from the Technopark Gate Pass System.
    </div>
  </div>
</div>
`
      ).catch(console.error);
    }

    res.json({
      message: "Gate pass rejected by CSO",
      pass,
    });

  } catch (error) {
    console.error("CSO REJECT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};