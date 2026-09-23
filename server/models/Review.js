const mongoose = require('mongoose');

// A review targets EITHER a farmer OR a product (not necessarily both).
// - product_id === null  →  farmer-level review (overall stall experience)
// - product_id set       →  product-level review
// farmer_id is always required on every review.
const reviewSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null }, // null = farmer-level review
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  farmer_response: { type: String }, // optional, farmer fills this in
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);
