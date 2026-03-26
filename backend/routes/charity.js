const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Charity = require('../models/Charity');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/donate', authMiddleware, async (req, res) => {
  try {
    const { amount, cause, message, anonymous } = req.body;
    
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `charity_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    
    const charity = new Charity({
      userId: req.userId,
      amount,
      cause,
      message,
      anonymous,
      orderId: order.id
    });
    
    await charity.save();
    
    res.json({ orderId: order.id, amount: order.amount, charityId: charity._id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating donation', error: error.message });
  }
});

router.post('/verify-donation', authMiddleware, async (req, res) => {
  try {
    const { orderId, paymentId, signature, charityId } = req.body;
    
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === signature) {
      await Charity.findByIdAndUpdate(charityId, {
        paymentId,
        status: 'completed'
      });
      res.json({ success: true, message: 'Donation successful' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Verification failed', error: error.message });
  }
});

module.exports = router;