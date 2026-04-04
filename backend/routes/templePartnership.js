const express = require('express');
const TemplePartnership = require('../models/TemplePartnership');
const router = express.Router();

// Submit partnership request
router.post('/request', async (req, res) => {
  try {
    const partnership = new TemplePartnership(req.body);
    await partnership.save();
    res.status(201).json({ message: 'Partnership request submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all partnership requests (Admin only)
router.get('/requests', async (req, res) => {
  try {
    const requests = await TemplePartnership.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;