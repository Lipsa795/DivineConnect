const mongoose = require('mongoose');

const CharitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  cause: {
    type: String,
    enum: ['temple_maintenance', 'food_donation', 'education', 'medical', 'other'],
    required: true
  },
  message: String,
  anonymous: {
    type: Boolean,
    default: false
  },
  paymentId: String,
  orderId: String,
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Charity', CharitySchema);