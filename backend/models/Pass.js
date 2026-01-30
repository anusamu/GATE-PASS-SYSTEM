const mongoose = require("mongoose");

const passSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "UserAuth" },
    requesterName: String,
    requesterEmail: String,

    department: String,
    hod: { type: mongoose.Schema.Types.ObjectId, ref: "UserAuth" },

    passType: {
      type: String,
      enum: ["RETURNABLE", "NON_RETURNABLE"],
      required: true,
    },

    assetName: { type: String, required: true },
    assetSerialNo: { type: String, required: true },
    purpose: { type: String },

    externalPersonName: { type: String, required: true },
    externalPersonEmail: { type: String, required: true },
    externalPersonPhone: String,

    outDate: { type: Date, default: Date.now },
    returnDateTime: Date,

    photo: {
      type: String,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    /* ===== SECURITY ADDITIONS ===== */
    qrCode: {
  type: String,
  unique: true,
  sparse: true,     // ✅ allows multiple null values
},
qrImage: {
  type: String, // base64 (optional)
},
    used: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pass", passSchema);
