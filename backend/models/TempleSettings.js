const mongoose = require('mongoose');

const DarshanSlotSchema = new mongoose.Schema({
  slotName: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  maxDevotees: { type: Number, default: 500 },
  currentCount: { type: Number, default: 0 }
});

const PoojaSlotSchema = new mongoose.Schema({
  poojaName: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['open', 'booked', 'pending'], default: 'open' },
  price: { type: Number, required: true }
});

const PrasadamItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  dailyProduction: { type: Number, default: 500 },
  remaining: { type: Number, default: 500 },
  maxLimit: { type: Number, default: 1000 },
  isAvailable: { type: Boolean, default: true }
});

const SamagriItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  lowStockAlert: { type: Number, default: 50 }
});

const EventSlotSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  date: { type: Date, required: true },
  totalCapacity: { type: Number, required: true },
  bookedCount: { type: Number, default: 0 },
  price: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
});

const TempleSettingsSchema = new mongoose.Schema({
  darshanSlots: [DarshanSlotSchema],
  poojaSlots: [PoojaSlotSchema],
  prasadamItems: [PrasadamItemSchema],
  samagriInventory: [SamagriItemSchema],
  eventSlots: [EventSlotSchema],
  queueStatus: {
    status: { type: String, enum: ['low', 'medium', 'high', 'full'], default: 'low' },
    waitingTime: { type: String, default: '10 mins' },
    lastUpdated: { type: Date, default: Date.now }
  },
  annadanam: {
    totalMeals: { type: Number, default: 1000 },
    remainingMeals: { type: Number, default: 1000 },
    servedCount: { type: Number, default: 0 }
  },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TempleSettings', TempleSettingsSchema);