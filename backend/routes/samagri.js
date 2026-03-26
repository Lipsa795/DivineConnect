const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Samagri = require('../models/Samagri');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/create-order', authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount, address, phone } = req.body;
    
    const options = {
      amount: totalAmount * 100,
      currency: 'INR',
      receipt: `samagri_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    
    const samagri = new Samagri({
      userId: req.userId,
      items,
      totalAmount,
      address,
      phone,
      orderId: order.id
    });
    
    await samagri.save();
    
    res.json({ orderId: order.id, amount: order.amount, samagriId: samagri._id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

router.post('/verify-payment', authMiddleware, async (req, res) => {
  try {
    const { orderId, paymentId, signature, samagriId } = req.body;
    
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === signature) {
      await Samagri.findByIdAndUpdate(samagriId, {
        paymentId,
        status: 'completed'
      });
      res.json({ success: true, message: 'Order confirmed' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Verification failed', error: error.message });
  }
});

module.exports = router;