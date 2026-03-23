const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: "gate_pass_config" },
  ccEmails: { type: [String], default: [] }
});

module.exports = mongoose.model('Settings', settingsSchema);