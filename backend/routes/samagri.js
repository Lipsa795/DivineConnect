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

// Create order (User)
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

// Verify payment (User)
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

// Get user's own orders (User)
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Samagri.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// ========== ADMIN ROUTES ==========

// Get all orders for admin
router.get('/all-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Samagri.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Update order status (Admin)
router.put('/:orderId/status', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const order = await Samagri.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order' });
  }
});

// Get order by ID (Admin)
router.get('/:orderId', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Samagri.findById(orderId).populate('userId', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order' });
  }
});

// Get today's orders (Admin)
router.get('/admin/today', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const orders = await Samagri.find({
      createdAt: { $gte: today, $lt: tomorrow }
    }).sort({ createdAt: -1 }).populate('userId', 'name email');
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching today\'s orders' });
  }
});

// Get orders by status (Admin)
router.get('/admin/by-status/:status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.params;
    const orders = await Samagri.find({ status })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders by status' });
  }
});

module.exports = router;