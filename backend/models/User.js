const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, unique: true, required: true },

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["admin", "hod", "security", "staff"],
    required: true
  },

  phone: { type: String },

  department: { type: String },

  // 🔐 Forgot Password fields
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date }
});

// 🔒 Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("UserAuth", userSchema);
