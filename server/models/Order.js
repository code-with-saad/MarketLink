const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price_at_order: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  total_amount: { type: Number },
  status: {
    type: String,
    enum: ['placed', 'accepted', 'ready', 'completed', 'cancelled'],
    default: 'placed',
  },
  pickup_date: { type: Date },
  pickup_slot: { type: String },
  // Calculated at order-placement time (slot_start − 2 hrs).
  // Stored per-order so later farmer setting changes don't retroactively
  // affect existing orders. Cancel/modify only allowed while now < cutoff_time.
  cutoff_time: { type: Date },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
