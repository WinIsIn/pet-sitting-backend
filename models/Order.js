const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 }
    }
  ],
  total: Number,
  status: { type: String, enum: ['pending', 'paid', 'shipped', 'completed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);