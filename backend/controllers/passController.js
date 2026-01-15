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
    })
      .populate("hod", "name email") // ✅ get HOD details
      .sort({ createdAt: -1 });

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
    "Gate Pass Approved", // ✅ SUBJECT REQUIRED
    `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; padding: 40px 10px; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    
    <div style="background: linear-gradient(135deg, #048cedff 0%, #09f097ff 100%); padding: 30px; text-align: center;">
      <img src="https://technopark.in/tp-logo.png" alt="Technopark" style="width: 180px; filter: brightness(0) invert(1);">
    </div>

    <div style="padding: 40px 30px;">
      <h2 style="color: #333; margin-top: 0; font-size: 24px; font-weight: 800;">Gate Pass Approved</h2>
      
      <p style="color: #555; font-size: 16px;">Hello,</p>
      
      <p style="color: #555; font-size: 16px;">
        Good news! Your gate pass for the asset 
        <strong style="color: #007cf0;">${pass.assetName}</strong>
        (Serial: <strong>${pass.assetSerialNo}</strong>) has been officially approved.
      </p>

      <div style="background-color: #f8fafb; border-radius: 8px; padding: 20px; border-left: 4px solid #00dfd8; margin: 25px 0;">
        <p style="margin: 0; font-size: 14px; color: #666;">
          You can now view your digital pass and download the PDF copy for security verification at the gate.
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <a href="https://your-app-link.com/pass/${pass._id}" 
           style="background: linear-gradient(135deg, #007cf0 0%, #00dfd8 100%); 
                  color: white; 
                  padding: 14px 32px; 
                  text-decoration: none; 
                  border-radius: 6px; 
                  font-weight: bold; 
                  display: inline-block;
                  box-shadow: 0 4px 10px rgba(0,124,240,0.3);">
           View & Download Pass
        </a>
      </div>
    </div>
  </div>
</div>
    `
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
    `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; padding: 40px 10px; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    
    <!-- HEADER -->
    <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center;">
      <img src="https://your-domain.com/technopark-logo.png" 
           alt="Technopark" 
           style="width: 180px; filter: brightness(0) invert(1);">
    </div>

    <!-- BODY -->
    <div style="padding: 40px 30px;">
      <h2 style="color: #333; margin-top: 0; font-size: 24px; font-weight: 800;">
        Gate Pass Rejected
      </h2>

      <p style="color: #555; font-size: 16px;">Hello,</p>

      <p style="color: #555; font-size: 16px;">
        We regret to inform you that your gate pass request for the asset
        <strong style="color: #dc2626;">${pass.assetName}</strong>
        has been rejected by the concerned authority.
      </p>

      <!-- REASON BOX -->
      <div style="background-color: #fff5f5; border-radius: 8px; padding: 20px; border-left: 4px solid #ef4444; margin: 25px 0;">
        <p style="margin: 0; font-size: 15px; color: #991b1b;">
          <strong>Reason for Rejection:</strong><br />
          ${pass.rejectionReason || "No specific reason provided"}
        </p>
      </div>

      <p style="color: #666; font-size: 14px;">
        If you believe this was a mistake or need further clarification, please contact your department HOD.
      </p>

      <!-- FOOTER -->
      <p style="color: #888; font-size: 13px; margin-top: 30px;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  </div>
</div>
    `
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