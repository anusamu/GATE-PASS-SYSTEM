const User = require("../models/User");
const Pass = require("../models/Pass");
const bcrypt = require("bcryptjs");
const Settings = require('../models/Settings');
/* =========================
   ADMIN ROLE CHECK
========================= */
const ensureAdmin = (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({
      success: false,
      message: "Admin access only",
    });
    return false;
  }
  return true;
};

/* =========================
   GET ALL USERS
========================= */
exports.getUsers = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const users = await User.find().select("-password");
    res.status(200).json(users);

  } catch (error) {
    console.error("Get users error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

/* =========================
   CREATE USER (ADMIN)
========================= */
exports.createUser = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const { name, email, password, role, department, phone } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // Prevent duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // ⚠️ IMPORTANT:
    // Do NOT hash password here
    // Schema pre-save hook will hash it
   const newUser = await User.create({
  name,
  email,
  password, // plain password (auto-hashed)
  role,
  department: role === "hod" || role === "staff" ? department : undefined,
  phone,
});

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department || null,
        phone: newUser.phone || null,
      },
    });

  } catch (error) {
    console.error("Create user error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};

/* =========================
   APPROVED PASS COUNT
========================= */
exports.approvedPassCount = async (req, res) => {
  try {
    const count = await Pass.countDocuments({ status: "APPROVED" });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Approved count error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch approved count",
    });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    // role check (since adminOnly middleware is NOT used)
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only",
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};
exports.getAllPassHistory = async (req, res) => {
  try {
    const { status } = req.query;

    let filter = {};

    if (status && ["APPROVED", "PENDING", "REJECTED"].includes(status)) {
      filter.status = status;
    }

    const passes = await Pass.find(filter).sort({ createdAt: -1 });

    res.status(200).json(passes);
  } catch (error) {
    console.error("Error fetching pass history:", error);
    res.status(500).json({
      message: "Failed to fetch pass history",
    });
  }
};


// @desc    Get the dynamic CC email list
// @route   GET /api/admin/settings/cc
exports.getCCList = async (req, res) => {
  try {
    const settings = await Settings.findOne({ key: "gate_pass_config" });
    // Return empty array if no settings found yet
    res.status(200).json(settings ? settings.ccEmails : []);
  } catch (error) {
    console.error("GET CC LIST ERROR:", error);
    res.status(500).json({ message: "Failed to fetch CC list" });
  }
};

// @desc    Update the dynamic CC email list
// @route   POST /api/admin/settings/cc
exports.updateCCList = async (req, res) => {
  try {
    const { emails } = req.body;

    if (!Array.isArray(emails)) {
      return res.status(400).json({ message: "Emails must be provided as an array" });
    }

    const updatedSettings = await Settings.findOneAndUpdate(
      { key: "gate_pass_config" },
      { ccEmails: emails },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "CC List updated successfully",
      ccEmails: updatedSettings.ccEmails
    });
  } catch (error) {
    console.error("UPDATE CC LIST ERROR:", error);
    res.status(500).json({ message: "Failed to update CC list" });
  }
};

