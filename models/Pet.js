const mongoose = require('mongoose');
const petSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'other'], required: true },
  breed: String,
  age: Number,
  weight: Number,
  description: String,
  imageUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Pet', petSchema);