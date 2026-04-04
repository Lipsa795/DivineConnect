const mongoose = require('mongoose');

const TemplePartnershipSchema = new mongoose.Schema({
  templeName: { type: String, required: true },
  templeCity: { type: String, required: true },
  templeState: { type: String, required: true },
  templeAddress: { type: String, required: true },
  contactPerson: { type: String, required: true },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
  templeType: String,
  establishedYear: String,
  deity: String,
  description: String,
  facilities: [String],
  poojaTypes: [String],
  prasadamTypes: [String],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TemplePartnership', TemplePartnershipSchema);