const mongoose = require('mongoose');

const farmerProfileSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stall_name: { type: String },
  markets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Market' }],
  operating_days: [{ type: String }],
  pickup_windows: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  auto_apply_weekly_template: { type: Boolean, default: false },
});

module.exports = mongoose.model('FarmerProfile', farmerProfileSchema);
