const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  poojaType: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: String,
  name: String,
  gotra: String,
  amount: {
    type: Number,
    required: true
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

module.exports = mongoose.model('Booking', BookingSchema);