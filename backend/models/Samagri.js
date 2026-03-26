const mongoose = require('mongoose');

const SamagriSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    name: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  phone: String,
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

module.exports = mongoose.model('Samagri', SamagriSchema);