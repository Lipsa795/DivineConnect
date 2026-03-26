const mongoose = require('mongoose');

const TempleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    lat: Number,
    lng: Number
  },
  address: String,
  city: String,
  state: String,
  description: String,
  imageUrl: String,
  deity: String,
  timings: String,
  contact: String
});

module.exports = mongoose.model('Temple', TempleSchema);