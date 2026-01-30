const Pass = require("../models/Pass");
const User = require("../models/User");
const sendMail = require("../utils/sendMail");
const mongoose = require("mongoose");
const generatePassPDF = require("../utils/generatePassPDF");
const path = require("path");
const fs = require("fs");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");

const isValidEmail = (email) =>
  typeof email === "string" &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const buildRecipients = (...emails) =>
  emails
    .map((e) => e?.trim())
    .filter(isValidEmail)
    .map((email) => ({ email }));



const baseUrl = process.env.APP_URL || "http://localhost:5000";
exports.createPass = async (req, res) => {
  try {
    const {
      assetName,
      assetSerialNo,
      externalPersonName,
      externalPersonEmail,
      externalPersonPhone,
      passType,
      purpose,
      returnDateTime,
    } = req.body;

    if (!assetName || !assetSerialNo || !externalPersonName || !externalPersonEmail || !passType) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const hod = await User.findOne({
      department: req.user.department,
      role: "hod",
    });

    if (!hod) {
      return res.status(404).json({ message: "No HOD found" });
    }

    const pass = await Pass.create({
  requester: req.user._id,
  requesterName: req.user.name,
  requesterEmail: req.user.email,
  department: req.user.department,
  hod: hod._id,
  assetName,
  assetSerialNo,
  purpose,
  externalPersonName,
  externalPersonEmail,
  externalPersonPhone,
  passType,
  returnDateTime: passType === "RETURNABLE" ? returnDateTime : null,
  photo: req.file ? req.file.path : null,
  status: "PENDING",
  used: false,        // optional clarity
});
    res.status(201).json(pass);

    const recipients = buildRecipients(hod.email);

    if (recipients.length) {
      sendMail(
        recipients,
        "New Gate Pass Request",
       `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; padding: 40px 10px; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    
    <div style="background: linear-gradient(135deg, #048cedff 0%, #09f097ff 100%); padding: 30px; text-align: center;">
      <img 
  src="https://gate-pass-system-kappa.vercel.app/tp-logo.png"
  alt="Technopark"
  style="width:180px; filter:brightness(0) invert(1);"
/>
    </div>

    <div style="padding: 40px 30px;">
      <h2 style="color: #333; margin-top: 0; font-size: 24px; font-weight: 800;">New Approval Request</h2>
      
      <p style="color: #555; font-size: 16px;">Hello,</p>
      
      <p style="color: #555; font-size: 16px;">
        A new gate pass request has been submitted by <strong>${req.user.name}</strong> for the following asset:
      </p>

      <div style="background-color: #f8fafb; border-radius: 8px; padding: 20px; border-left: 4px solid #007cf0; margin: 25px 0;">
        <p style="margin: 5px 0; font-size: 15px; color: #333;"><strong>Asset:</strong> ${pass.assetName}</p>
        <p style="margin: 5px 0; font-size: 15px; color: #333;"><strong>Serial No:</strong> ${pass.assetSerialNo}</p>
      </div>

      <p style="color: #555; font-size: 14px;">
        Please log in to the portal to review the details and provide your approval.
      </p>

      <div style="text-align: center; margin-top: 30px;">
        <a href="https://gate-pass-system-kappa.vercel.app/" 
           style="background: linear-gradient(135deg, #007cf0 0%, #00dfd8 100%); 
                  color: white; 
                  padding: 14px 32px; 
                  text-decoration: none; 
                  border-radius: 6px; 
                  font-weight: bold; 
                  display: inline-block;
                  box-shadow: 0 4px 10px rgba(0,124,240,0.3);">
            Login to Approve
        </a>
      </div>
    </div>
    
    <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
      This is an automated notification from the Technopark Gate Pass System.
    </div>
  </div>
</div>
`
      ).catch(console.error);
    }
  } catch (error) {
    console.error("CREATE PASS ERROR:", error);
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
   HOD APPROVE PASS
===================================================== */
exports.approvePass = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Pass ID" });
    }

    const pass = await Pass.findById(id);
    if (!pass) return res.status(404).json({ message: "Pass not found" });

    if (pass.hod.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (pass.status !== "PENDING") {
      return res.status(400).json({ message: `Already ${pass.status}` });
    }

    /* ================== QR GENERATION ================== */
    if (!pass.qrCode) {
      const uniqueCode = uuidv4(); // UNIQUE PASS CODE
      pass.qrCode = uniqueCode;

      // Optional: QR image (base64) if you want to show in email / card
      const qrImage = await QRCode.toDataURL(uniqueCode);
      pass.qrImage = qrImage; // add field if needed
    }

    pass.status = "APPROVED";
    pass.used = false;
    pass.approvedAt = new Date();

    await pass.save();
    /* =================================================== */
 const recipients = buildRecipients(
      pass.requesterEmail,
      pass.externalPersonEmail
    );

    if (recipients.length) {
      sendMail(
        recipients,
        "Gate Pass Approved",
       `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; padding: 40px 10px; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    
    <div style="background: linear-gradient(135deg, #048cedff 0%, #09f097ff 100%); padding: 30px; text-align: center;">
      <img 
  src="https://gate-pass-system-kappa.vercel.app/tp-logo.png"
  alt="Technopark"
  style="width:180px; filter:brightness(0) invert(1);"
/>
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
        <a href="${process.env.BACKEND_URL}/pass/view/${pass._id}" 
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
      ).catch(console.error);
    }


    res.json({
      message: "Gate pass approved & QR generated",
      pass,
    });
  } catch (error) {
    console.error("APPROVE PASS ERROR:", error);
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
// 

/* =====================================================
   HOD REJECT PASS
===================================================== */
exports.rejectPass = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const pass = await Pass.findById(id);
    if (!pass) return res.status(404).json({ message: "Pass not found" });

    if (pass.hod.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    pass.status = "REJECTED";
    pass.rejectionReason = reason || "No reason provided";
    pass.rejectedAt = new Date();
    await pass.save();

    const recipients = buildRecipients(
      pass.requesterEmail,
      pass.externalPersonEmail
    );

    if (recipients.length) {
      sendMail(
        recipients,
        "Gate Pass Rejected",
       `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; padding: 40px 10px; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    
    <!-- HEADER -->
    <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center;">
      <img 
  src="https://gate-pass-system-kappa.vercel.app/tp-logo.png"
  alt="Technopark"
  style="width:180px; filter:brightness(0) invert(1);"
/>
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
      ).catch(console.error);
    }

    res.json({ message: "Gate pass rejected", pass });
  } catch (error) {
    console.error("REJECT PASS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};




exports.getHistory = async (req, res) => {
  try {
    // 🔐 req.user must come from auth middleware
    if (!req.user || !req.user._id || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not found",
      });
    }

    const userId = req.user._id;
    const role = String(req.user.role).toLowerCase();

    let result = [];

    /* ================= STAFF ================= */
    if (role === "staff") {
      result = await Pass.find({ requester: userId })
        .sort({ createdAt: -1 });
    }

    /* ================= HOD ================= */
    else if (role === "hod") {
      result = await Pass.find({ hod: userId })
        .sort({ createdAt: -1 });
    }

    /* ================= SECURITY ================= */
    else if (role === "security") {
      result = await Pass.find({ status: "APPROVED" })
        .sort({ updatedAt: -1 });
    }

    /* ================= NOT ALLOWED ================= */
    else {
      return res.status(403).json({
        success: false,
        message: "Role not authorized for history access",
      });
    }

    return res.status(200).json({
      success: true,
      data: result, // always array
    });

  } catch (error) {
    console.error("History error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch history",
    });
  }
};

/* =====================================================
   CREATE PASS BY HOD (AUTO APPROVED)
===================================================== */
exports.createPassHod = async (req, res) => {
  try {
    const pass = await Pass.create({
      requester: req.user._id,
      requesterName: req.user.name,
      requesterEmail: req.user.email,
      department: req.user.department,
      hod: req.user._id,
      ...req.body,
      status: "APPROVED",
      approvedAt: new Date(),
    });

    const recipients = buildRecipients(pass.externalPersonEmail);

    if (recipients.length) {
      await sendMail(
        recipients,
        "Gate Pass Approved",
        `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; padding: 40px 10px; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    
    <div style="background: linear-gradient(135deg, #048cedff 0%, #09f097ff 100%); padding: 30px; text-align: center;">
        <img 
  src="https://gate-pass-system-kappa.vercel.app/tp-logo.png"
  alt="Technopark"
  style="width:180px; filter:brightness(0) invert(1);"
/>
    </div>

    <div style="padding: 40px 30px;">
      <h2 style="color: #333; margin-top: 0; font-size: 24px; font-weight: 800;">Gate Pass Approved</h2>
      
      <p style="color: #555; font-size: 16px;">Hello <strong>${pass.externalPersonName}</strong>,</p>
      
      <p style="color: #555; font-size: 16px;">
        Your gate pass request has been <span style="color: #09f097ff; font-weight: bold;">APPROVED</span>. 
        You are now authorized for entry/exit regarding the following asset:
      </p>

      <div style="background-color: #f8fafb; border-radius: 8px; padding: 20px; border-left: 4px solid #09f097ff; margin: 25px 0;">
        <p style="margin: 5px 0; font-size: 15px; color: #333;"><strong>Asset:</strong> ${pass.assetName}</p>
        <p style="margin: 5px 0; font-size: 15px; color: #333;"><strong>Serial No:</strong> ${pass.assetSerialNo}</p>
      </div>

      <p style="color: #666; font-size: 14px;">
        Please click the button below to view your digital pass. You may be required to show this at the security gate.
      </p>

      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.BACKEND_URL}/pass/view/${pass._id}" 
           style="background: linear-gradient(135deg, #007cf0 0%, #00dfd8 100%); 
                  color: white; 
                  padding: 14px 32px; 
                  text-decoration: none; 
                  border-radius: 6px; 
                  font-weight: bold; 
                  display: inline-block;
                  box-shadow: 0 4px 10px rgba(0,124,240,0.3);">
            View & Download Gate Pass
        </a>
      </div>

      <p style="margin-top: 40px; color: #888; font-size: 14px;">
        Regards,<br/>
        <strong style="color: #333;">Security Team</strong>
      </p>
    </div>
    
    <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
      This is an automated message. Please do not reply to this email.
    </div>
  </div>
</div>
`
      );
    }

    res.status(201).json({ message: "Pass created & approved", pass });
  } catch (error) {
    console.error("HOD CREATE PASS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};



/* =====================================================
   DOWNLOAD PASS PDF
===================================================== */
exports.downloadPass = async (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "../uploads/passes",
      `gatepass-${req.params.id}.pdf`
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("PDF not found");
    }

    res.download(filePath, "GatePass.pdf");
  } catch (error) {
    console.error("DOWNLOAD PASS ERROR:", error);
    res.status(500).send("Server error");
  }
};

/* =====================================================
   VIEW PASS DETAILS (HTML PAGE)
===================================================== */
exports.viewPass = async (req, res) => {
  try {
    const pass = await Pass.findById(req.params.id);

    if (!pass || pass.status !== "APPROVED") {
      return res.status(404).send("<h2>Pass not found or not approved</h2>");
    }

    const pdfUrl = `${process.env.BACKEND_URL}/pass/download/${pass._id}`;

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Gate Pass</title>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f4f7fb;
            padding: 40px;
          }
          .card {
            max-width: 600px;
            margin: auto;
            background: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          }
          h2 {
            text-align: center;
            color: #2563eb;
          }
          .row {
            margin-bottom: 10px;
          }
          .label {
            font-weight: bold;
            color: #333;
          }
          .btn {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 20px;
            background: #22c55e;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Gate Pass</h2>

          <div class="row"><span class="label">Requester:</span> ${pass.requesterName}</div>
          <div class="row"><span class="label">Department:</span> ${pass.department}</div>

          <hr />

          <div class="row"><span class="label">Asset:</span> ${pass.assetName}</div>
          <div class="row"><span class="label">Serial No:</span> ${pass.assetSerialNo}</div>
          <div class="row"><span class="label">Purpose:</span> ${pass.purpose || "-"}</div>

          <hr />

          <div class="row"><span class="label">External Person:</span> ${pass.externalPersonName}</div>
          <div class="row"><span class="label">Email:</span> ${pass.externalPersonEmail}</div>

          ${
            pass.passType === "RETURNABLE"
              ? `<div class="row"><span class="label">Return Date:</span> ${new Date(
                  pass.returnDateTime
                ).toLocaleString()}</div>`
              : ""
          }

          <div style="text-align:center">
            <a class="btn" href="${pdfUrl}" target="_blank">
              Download Gate Pass (PDF)
            </a>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("VIEW PASS ERROR:", error);
    res.status(500).send("<h2>Server error</h2>");
  }
};


