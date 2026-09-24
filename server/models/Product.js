const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: { type: String }, // vegetables, fruits, dairy, baked goods, etc.
  price: { type: Number },
  unit: { type: String },
  quantity_available: { type: Number, default: 0 },
  weekly_template_quantity: { type: Number, default: 0 },
  description: { type: String },
  image_url: { type: String },
  is_sold_out: { type: Boolean, default: false },
});

module.exports = mongoose.model('Product', productSchema);
