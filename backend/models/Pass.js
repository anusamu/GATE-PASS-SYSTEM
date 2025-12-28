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
    },

    assetName: String,
    assetSerialNo: String,

    externalPersonName: String,
    externalPersonEmail: String,

    outDate: String,
    returnDateTime: String,

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pass", passSchema);
