const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, unique: true, required: true },

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["admin", "hod", "security", "staff","cso"],
    required: true
  },

  phone: { type: String },

  department: { type: String },

  // 🔐 Forgot Password fields
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date }
});

// 🔒 Hash password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});


module.exports = mongoose.model("UserAuth", userSchema);
