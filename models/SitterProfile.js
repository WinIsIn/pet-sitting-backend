const mongoose = require('mongoose'); // ⬅️ ⬅️ ⬅️ 一定要放這行！目前你漏了！

const sitterProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: String,
  services: [String],
  availableDates: [Date],
  ratePerDay: Number,
  location: String,
  imageUrl: String
}, { timestamps: true });

module.exports = mongoose.model('SitterProfile', sitterProfileSchema);
