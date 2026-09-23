const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },    // optional
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // optional
});

module.exports = mongoose.model('Favorite', favoriteSchema);
