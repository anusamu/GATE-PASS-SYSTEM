const Pass = require("../models/Pass");
const User = require("../models/User");
const sendMail = require("../utils/sendMail");

// STAFF CREATE PASS
exports.createPass = async (req, res) => {
  const hod = await User.findOne({
    department: req.user.department,
    role: "hod",
  });

  const pass = await Pass.create({
    ...req.body,
    requester: req.user._id,
    requesterName: req.user.name,
    requesterEmail: req.user.email,
    department: req.user.department,
    hod: hod._id,
  });

  // Notify HOD
  await sendMail(
    hod.email,
    "New Gate Pass Approval Request",
    `<p>${req.user.name} has requested a gate pass.</p>`
  );

  res.json(pass);
};

// STAFF VIEW PASSES
exports.myPasses = async (req, res) => {
  const passes = await Pass.find({ requester: req.user._id });
  res.json(passes);
};

// HOD VIEW PENDING
exports.pendingApprovals = async (req, res) => {
  const passes = await Pass.find({
    hod: req.user._id,
    status: "PENDING",
  });
  res.json(passes);
};

// HOD APPROVE
exports.approvePass = async (req, res) => {
  const pass = await Pass.findById(req.params.id);

  pass.status = "APPROVED";
  await pass.save();

  // Notify requester + external
  await sendMail(
    [pass.requesterEmail, pass.externalPersonEmail],
    "Gate Pass Approved",
    `<p>Your gate pass has been approved.</p>`
  );

  res.json({ message: "Approved" });
};
// HOD REJECT PASS
exports.rejectPass = async (req, res) => {
  try {
    const { reason } = req.body;

    const pass = await Pass.findById(req.params.id);

    if (!pass) {
      return res.status(404).json({ message: "Pass not found" });
    }

    // Only assigned HOD can reject
    if (pass.hod.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    pass.status = "REJECTED";
    pass.rejectionReason = reason || "Rejected by HOD";
    await pass.save();

    // Notify requester + external person
    await sendMail(
      [pass.requesterEmail, pass.externalPersonEmail],
      "Gate Pass Rejected",
      `
        <h3>Gate Pass Rejected</h3>
        <p><b>Asset:</b> ${pass.assetName}</p>
        <p><b>Reason:</b> ${pass.rejectionReason}</p>
      `
    );

    res.json({ message: "Gate pass rejected successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
