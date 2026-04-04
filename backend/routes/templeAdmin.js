const express = require('express');
const router = express.Router();
const TempleSettings = require('../models/TempleSettings');
const authMiddleware = require('../middleware/auth');

// Get temple settings
router.get('/settings', authMiddleware, async (req, res) => {
  try {
    let settings = await TempleSettings.findOne();
    if (!settings) {
      settings = new TempleSettings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update darshan slots
router.put('/darshan-slots', authMiddleware, async (req, res) => {
  try {
    const { slots } = req.body;
    let settings = await TempleSettings.findOne();
    if (!settings) settings = new TempleSettings();
    settings.darshanSlots = slots;
    settings.updatedAt = new Date();
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update prasadam item
router.put('/prasadam/:itemId', authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { remaining, dailyProduction, maxLimit } = req.body;
    let settings = await TempleSettings.findOne();
    const item = settings.prasadamItems.id(itemId);
    if (item) {
      if (remaining !== undefined) item.remaining = remaining;
      if (dailyProduction !== undefined) item.dailyProduction = dailyProduction;
      if (maxLimit !== undefined) item.maxLimit = maxLimit;
      item.isAvailable = item.remaining > 0;
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update queue status
router.put('/queue-status', authMiddleware, async (req, res) => {
  try {
    const { status, waitingTime } = req.body;
    let settings = await TempleSettings.findOne();
    if (!settings) settings = new TempleSettings();
    settings.queueStatus = { status, waitingTime, lastUpdated: new Date() };
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update annadanam
router.put('/annadanam', authMiddleware, async (req, res) => {
  try {
    const { totalMeals, remainingMeals } = req.body;
    let settings = await TempleSettings.findOne();
    if (!settings) settings = new TempleSettings();
    settings.annadanam = { 
      totalMeals: totalMeals || settings.annadanam?.totalMeals || 1000,
      remainingMeals: remainingMeals !== undefined ? remainingMeals : settings.annadanam?.remainingMeals || 1000,
      servedCount: settings.annadanam?.servedCount || 0
    };
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update samagri inventory
router.put('/samagri/:itemId', authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    let settings = await TempleSettings.findOne();
    const item = settings.samagriInventory.id(itemId);
    if (item) {
      item.quantity = quantity;
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update event slot
router.put('/event-slot/:eventId', authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { bookedCount } = req.body;
    let settings = await TempleSettings.findOne();
    const event = settings.eventSlots.id(eventId);
    if (event) {
      event.bookedCount = bookedCount;
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add event slot
router.post('/event-slot', authMiddleware, async (req, res) => {
  try {
    const { eventName, date, totalCapacity, price } = req.body;
    let settings = await TempleSettings.findOne();
    if (!settings) settings = new TempleSettings();
    settings.eventSlots.push({ eventName, date, totalCapacity, price });
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add pooja slot
router.post('/pooja-slot', authMiddleware, async (req, res) => {
  try {
    const { poojaName, date, time, price } = req.body;
    let settings = await TempleSettings.findOne();
    if (!settings) settings = new TempleSettings();
    settings.poojaSlots.push({ poojaName, date, time, price });
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update pooja slot status
router.put('/pooja-slot/:slotId', authMiddleware, async (req, res) => {
  try {
    const { slotId } = req.params;
    const { status } = req.body;
    let settings = await TempleSettings.findOne();
    const slot = settings.poojaSlots.id(slotId);
    if (slot) {
      slot.status = status;
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;