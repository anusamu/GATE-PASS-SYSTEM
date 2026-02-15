const mongoose = require("mongoose");
const Pass = require("../models/Pass");

/* =========================================
   VERIFY QR CODE
========================================= */
exports.verifyQRCode = async (req, res) => {
  try {
    let { qrCode } = req.body;

    if (!qrCode) {
      return res.status(400).json({ message: "QR Code missing" });
    }

    // 🔥 If full URL, extract last part
    if (qrCode.includes("/")) {
      qrCode = qrCode.split("/").pop();
    }

    let pass;

    // ✅ If valid ObjectId → search by _id
    if (mongoose.Types.ObjectId.isValid(qrCode)) {
      pass = await Pass.findById(qrCode);
    } else {
      // ✅ Otherwise search by qrCode field
      pass = await Pass.findOne({ qrCode });
    }

    if (!pass) {
      return res.status(404).json({ message: "Invalid Pass" });
    }

    if (pass.status !== "APPROVED") {
      return res.status(403).json({ message: "Pass not approved" });
    }

    if (pass.used) {
      return res.status(409).json({ message: "Pass already used" });
    }

    return res.status(200).json(pass);

  } catch (error) {
    console.error("VERIFY QR ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


/* =========================================
   MARK PASS AS USED
========================================= */
exports.markPassAsUsed = async (req, res) => {
  try {
    const pass = await Pass.findById(req.params.id);

    if (!pass) {
      return res.status(404).json({ message: "Pass not found" });
    }

    if (pass.used) {
      return res.status(400).json({ message: "Already marked used" });
    }

    pass.used = true;
    pass.usedAt = new Date();
    await pass.save();

    res.json({ message: "Entry marked successfully" });

  } catch (error) {
    console.error("MARK USED ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
