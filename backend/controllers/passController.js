const Pass = require("../models/Pass");
const User = require("../models/User");
const sendMail = require("../utils/sendMail");
const mongoose = require("mongoose");

/* =====================================================
   STAFF CREATE PASS  (Assign to SINGLE HOD)
===================================================== */
exports.createPass = async (req, res) => {
  try {
    // 1. Find the HOD belonging to the same department as the staff
    const hod = await User.findOne({
      department: req.user.department,
      role: "hod",
    });

    if (!hod) {
      return res.status(404).json({ message: "No HOD found for your department" });
    }

    // 2. Create pass and link it to the found HOD's ID
    const pass = await Pass.create({
      ...req.body,
      requester: req.user._id,
      requesterName: req.user.name,
      requesterEmail: req.user.email,
      department: req.user.department,
      hod: hod._id, // Dashboard will filter by this ID
      status: "PENDING",
    });

    await sendMail(hod.email, "New Request", `<p>Request from ${req.user.name}</p>`);
    res.status(201).json(pass);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.myPasses = async (req, res) => {
  try {
    const passes = await Pass.find({
      requester: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(passes);
  } catch (error) {
    console.error("My passes error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.pendingApprovals = async (req, res) => {
  try {
    // 3. Find passes where the 'hod' field matches the logged-in user's ID
    const passes = await Pass.find({
      hod: req.user._id, 
      status: "PENDING",
    }).sort({ createdAt: -1 });

    res.json(passes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   STAFF VIEW OWN PASSES
===================================================== */


/* =====================================================
   HOD VIEW PENDING PASSES (ONLY HIS PASSES)
===================================================== */
// exports.pendingApprovals = async (req, res) => {
//   try {
//     const passes = await Pass.find({
//       hod: req.user._id,        // ✅ MUST MATCH LOGGED-IN HOD
//       status: "PENDING",
//     }).sort({ createdAt: -1 });

//     res.json(passes);
//   } catch (error) {
//     console.error("Pending approvals error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

/* =====================================================
   HOD APPROVE PASS
===================================================== */
exports.approvePass = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Pass ID format" });
    }

    const pass = await Pass.findById(id);

    if (!pass) {
      return res.status(404).json({ message: "Pass not found" });
    }

    // 2. Authorization Check (Must be the assigned HOD)
    if (pass.hod.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to approve this pass" });
    }

    // 3. Status Check
    if (pass.status !== "PENDING") {
      return res.status(400).json({ message: `Pass already ${pass.status.toLowerCase()}` });
    }

    // 4. Update Pass
    pass.status = "APPROVED";
    pass.approvedAt = new Date();
    await pass.save();

    // 5. Send Emails (Non-blocking)
    const recipients = [pass.requesterEmail, pass.externalPersonEmail].filter(Boolean);
    if (recipients.length > 0) {
      sendMail(
        recipients,
        "Gate Pass Approved",
        `<h3>Gate Pass Approved</h3>
         <p>Your gate pass for <b>${pass.assetName}</b> has been approved.</p>`
      ).catch(err => console.error("Email Error:", err)); 
    }

    res.json({ message: "Gate pass approved successfully", pass });
  } catch (error) {
    console.error("Approve pass error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   HOD REJECT PASS
===================================================== */
exports.rejectPass = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Pass ID format" });
    }

    const pass = await Pass.findById(id);

    if (!pass) {
      return res.status(404).json({ message: "Pass not found" });
    }

    if (pass.hod.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to reject this pass" });
    }

    if (pass.status !== "PENDING") {
      return res.status(400).json({ message: `Pass already ${pass.status.toLowerCase()}` });
    }

    // Update Pass
    pass.status = "REJECTED";
    pass.rejectionReason = reason || "No specific reason provided by HOD";
    pass.rejectedAt = new Date();
    await pass.save();

    // Send Emails
    const recipients = [pass.requesterEmail, pass.externalPersonEmail].filter(Boolean);
    if (recipients.length > 0) {
      sendMail(
        recipients,
        "Gate Pass Rejected",
        `<h3>Gate Pass Rejected</h3>
         <p><b>Reason:</b> ${pass.rejectionReason}</p>`
      ).catch(err => console.error("Email Error:", err));
    }

    res.json({ message: "Gate pass rejected successfully", pass });
  } catch (error) {
    console.error("Reject pass error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getRecentPasses = async (req, res) => {
  try {
    const passes = await Pass.find({ requester: req.user._id })
      .sort({ createdAt: -1 })
      .limit(4);
    res.json(passes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};