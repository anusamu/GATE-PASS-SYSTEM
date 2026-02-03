const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");
/* =========================
   TOKEN GENERATOR
========================= */
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

/* =========================
   LOGIN (ALL ROLES)
========================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2️⃣ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // 3️⃣ Generate JWT
    const token = generateToken(user);

    // 4️⃣ Role-based response (single controller)
    res.status(200).json({
      token,
      role: user.role,          // admin | hod | security | staff
      name: user.name,
       email: user.email,
      department: user.department || null,
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};


/* =========================
   STAFF SELF REGISTER
========================= */
exports.staffRegister = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    // 🔍 Check email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 🔐 Hash password


    // ✅ IMPORTANT: Do NOT include phone at all
    const user = await User.create({
      name,
      email,
      password,
      role: "staff",
      department,
      // ❌ phone intentionally omitted
    });

    // ✅ Remove sensitive fields from response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    };

    res.status(201).json({
      message: "Staff registered successfully",
      user: userResponse,
    });

  } catch (error) {
    console.error("Staff register error:", error);

    // 🔥 Handle duplicate key clearly
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate value error (email or phone already exists)",
      });
    }

    res.status(500).json({ message: "Registration failed" });
  }
};


/* =========================
   ADMIN CREATE USER
========================= */
exports.createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role ,department } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      department // admin | hod | security | staff
    });

    res.status(201).json({
      message: "User created by admin",
      user,
    });

  } catch (error) {
    console.error("Admin create user error:", error);
    res.status(500).json({ message: "User creation failed" });
  }
};
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};









exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save({ validateBeforeSave: false });

    // 🔗 FRONTEND reset link
    const resetUrl = `${process.env.APP_URL}/reset-password/${resetToken}`;
const htmlContent = `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; padding: 40px 10px; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    
    <!-- HEADER -->
    <div style="background: linear-gradient(135deg, #048cedff 0%, #09f097ff 100%); padding: 30px; text-align: center;">
      <img 
        src="https://gate-pass-system-kappa.vercel.app/tp-logo.png"
        alt="Gate Pass System"
        style="width:180px; filter:brightness(0) invert(1);"
      />
    </div>

    <!-- BODY -->
    <div style="padding: 40px 30px;">
      <h2 style="color: #333; margin-top: 0; font-size: 24px; font-weight: 800;">
        Password Reset Request
      </h2>
      
      <p style="color: #555; font-size: 16px;">
        Hello <strong>${user.name}</strong>,
      </p>
      
      <p style="color: #555; font-size: 16px;">
        We received a request to reset your account password for the 
        <strong>Gate Pass System</strong>.
      </p>

      <div style="background-color: #f8fafb; border-radius: 8px; padding: 20px; border-left: 4px solid #007cf0; margin: 25px 0;">
        <p style="margin: 0; font-size: 15px; color: #333;">
          Click the button below to securely reset your password.
        </p>
      </div>

      <!-- BUTTON -->
      <div style="text-align: center; margin-top: 30px;">
        <a href="${resetUrl}" 
           style="background: linear-gradient(135deg, #007cf0 0%, #00dfd8 100%); 
                  color: white; 
                  padding: 14px 32px; 
                  text-decoration: none; 
                  border-radius: 6px; 
                  font-weight: bold; 
                  display: inline-block;
                  box-shadow: 0 4px 10px rgba(0,124,240,0.3);">
            Reset Password
        </a>
      </div>

      <p style="margin-top: 30px; color: #666; font-size: 14px;">
        ⏳ <strong>This link will expire in 15 minutes.</strong>
      </p>

      <p style="color: #888; font-size: 14px;">
        If you did not request a password reset, please ignore this email.  
        Your account will remain secure.
      </p>

      <p style="margin-top: 40px; color: #888; font-size: 14px;">
        Regards,<br/>
        <strong style="color: #333;">Gate Pass System Support Team</strong>
      </p>
    </div>
    
    <!-- FOOTER -->
    <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
      This is an automated message. Please do not reply to this email.
    </div>
  </div>
</div>
`;

    

    // ✅ IMPORTANT: recipients MUST be an ARRAY
    await sendMail(
      [user.email],                 // recipients
      "Reset Your Password",         // subject
      htmlContent                    // htmlContent
    );

    return res.status(200).json({
      message: "Password reset link sent to email",
    });

  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};




exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = password; // will auto-hash via pre-save
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
