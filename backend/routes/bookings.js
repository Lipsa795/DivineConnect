const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/create-order', authMiddleware, async (req, res) => {
  try {
    const { poojaType, date, time, name, gotra, amount } = req.body;
    
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `booking_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    
    const booking = new Booking({
      userId: req.userId,
      poojaType,
      date,
      time,
      name,
      gotra,
      amount,
      orderId: order.id
    });
    
    await booking.save();
    
    res.json({ orderId: order.id, amount: order.amount, bookingId: booking._id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

router.post('/verify-payment', authMiddleware, async (req, res) => {
  try {
    const { orderId, paymentId, signature, bookingId } = req.body;
    
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === signature) {
      await Booking.findByIdAndUpdate(bookingId, {
        paymentId,
        status: 'completed'
      });
      res.json({ success: true, message: 'Payment verified' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Verification failed', error: error.message });
  }
});

router.get('/my-bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

module.exports = router;