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

// Create order (User)
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

// Verify payment (User)
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

// Get user's own bookings (User)
router.get('/my-bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// ========== ADMIN ROUTES ==========

// Get all bookings for admin
router.get('/all-bookings', authMiddleware, async (req, res) => {
  try {
    // You can add role check here if needed
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Update booking status (Admin)
router.put('/:bookingId/status', authMiddleware, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json({ success: true, booking });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Error updating booking' });
  }
});

// Get booking by ID (Admin)
router.get('/:bookingId', authMiddleware, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId).populate('userId', 'name email');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking' });
  }
});

// Get today's bookings (Admin)
router.get('/admin/today', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const bookings = await Booking.find({
      date: { $gte: today, $lt: tomorrow }
    }).sort({ time: 1 }).populate('userId', 'name email');
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching today\'s bookings' });
  }
});

// Get bookings by date range (Admin)
router.get('/admin/by-date', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const bookings = await Booking.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).sort({ date: 1 }).populate('userId', 'name email');
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings by date' });
  }
});

module.exports = router;