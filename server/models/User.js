const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['customer', 'farmer', 'admin'], required: true },
  contact_number: { type: String },
  address: { type: String },
  status: { type: String, enum: ['pending', 'active', 'suspended'], default: 'active' },
  otp_code: { type: String },
  otp_expires_at: { type: Date },
  otp_resend_count: { type: Number, default: 0 },
  otp_last_sent_at: { type: Date },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);

