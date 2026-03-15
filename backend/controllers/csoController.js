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
        <h2>Gate Pass Approved</h2>

        <p>Your gate pass for asset <b>${pass.assetName}</b> has been approved by the Chief Security Officer.</p>

        <p>Serial Number: <b>${pass.assetSerialNo}</b></p>

        <a href="${process.env.BACKEND_URL}/pass/view/${pass._id}">
        View Gate Pass
        </a>
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
        <h2>Gate Pass Rejected</h2>

        <p>Your gate pass request for asset <b>${pass.assetName}</b> has been rejected by the Chief Security Officer.</p>

        <p><b>Reason:</b> ${pass.rejectionReason}</p>
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