const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Prasadam = require('../models/Prasadam');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order for prasadam
router.post('/create-order', authMiddleware, async (req, res) => {
  try {
    const { prasadamType, prasadamName, quantity, totalAmount, name, address, phone, message } = req.body;
    
    // Create Razorpay order
    const options = {
      amount: totalAmount * 100, // Convert to paise
      currency: 'INR',
      receipt: `prasadam_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    
    // Save prasadam order to database
    const prasadam = new Prasadam({
      userId: req.userId,
      prasadamType,
      prasadamName,
      quantity,
      totalAmount,
      name,
      address,
      phone,
      message,
      orderId: order.id,
      status: 'pending'
    });
    
    await prasadam.save();
    
    res.json({ 
      orderId: order.id, 
      amount: order.amount, 
      prasadamId: prasadam._id 
    });
    
  } catch (error) {
    console.error('Error creating prasadam order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

// Verify payment
router.post('/verify-payment', authMiddleware, async (req, res) => {
  try {
    const { orderId, paymentId, signature, prasadamId } = req.body;
    
    // Verify signature
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === signature) {
      // Update order status
      await Prasadam.findByIdAndUpdate(prasadamId, {
        paymentId,
        status: 'completed'
      });
      res.json({ success: true, message: 'Payment verified' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Verification failed', error: error.message });
  }
});

// Get user's prasadam orders
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Prasadam.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

module.exports = router;