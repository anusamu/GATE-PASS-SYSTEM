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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins

    await user.save();

    const resetUrl = `${process.env.APP_URL}/reset-password/${resetToken}`;

    const message = `
      <h3>Password Reset</h3>
      <p>Click below to reset your password</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link is valid for 15 minutes</p>
    `;

    await sendEmail({
      to: user.email,
      subject: "Reset Your Password",
      html: message
    });

    res.json({ message: "Password reset link sent to email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
