const Pass = require("../models/Pass");

/* =========================================
   VERIFY QR CODE
   ========================================= */
exports.verifyQRCode = async (req, res) => {
  const { qrCode } = req.body;

  const pass = await Pass.findOne({ qrCode });

  if (!pass)
    return res.status(404).json({ message: "Invalid Pass" });

  if (pass.status !== "APPROVED")
    return res.status(403).json({ message: "Pass not approved" });

  if (pass.used)
    return res.status(409).json({ message: "Pass already used" });

  return res.status(200).json(pass);
};

/* =========================================
   MARK PASS AS READ (USED)
   ========================================= */
exports.markPassAsUsed = async (req, res) => {
  await Pass.findByIdAndUpdate(req.params.id, { used: true });
  res.json({ message: "Entry marked successfully" });
};

