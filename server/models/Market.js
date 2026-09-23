const mongoose = require('mongoose');

const marketSchema = new mongoose.Schema({
  market_name: { type: String, required: true },
  address: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  operating_days: [{ type: String }],
  timings: { type: String },
});

module.exports = mongoose.model('Market', marketSchema);
