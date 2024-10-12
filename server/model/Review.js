const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  description: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
});

module.exports = mongoose.model('Review', reviewSchema);
