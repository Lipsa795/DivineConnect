const express = require('express');
const Temple = require('../models/Temple');
const router = express.Router();

// Seed some temples (run once)
router.get('/seed', async (req, res) => {
  const temples = [
    { name: "Shri Kashi Vishwanath", location: { lat: 25.3176, lng: 82.9739 }, address: "Varanasi, UP", city: "Varanasi", description: "Famous Jyotirlinga temple", deity: "Lord Shiva", timings: "4 AM - 11 PM" },
    { name: "Shree Siddhivinayak", location: { lat: 19.0330, lng: 72.8277 }, address: "Mumbai", city: "Mumbai", description: "Ganesha temple", deity: "Lord Ganesha", timings: "5 AM - 10 PM" },
    { name: "ISKCON Temple Delhi", location: { lat: 28.6139, lng: 77.2090 }, address: "Delhi", city: "Delhi", description: "Hare Krishna temple", deity: "Lord Krishna", timings: "4:30 AM - 9 PM" },
    { name: "Meenakshi Temple", location: { lat: 9.9195, lng: 78.1193 }, address: "Madurai", city: "Madurai", description: "Historic temple", deity: "Meenakshi Amman", timings: "5 AM - 10 PM" }
  ];
  
  await Temple.insertMany(temples);
  res.json({ message: "Temples seeded" });
});

router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, range } = req.query;
    const temples = await Temple.find({});
    
    // Filter temples within range (in km)
    const filtered = temples.filter(temple => {
      if (!temple.location || !temple.location.lat) return false;
      const distance = getDistanceFromLatLonInKm(lat, lng, temple.location.lat, temple.location.lng);
      return distance <= (range || 50);
    });
    
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching temples' });
  }
});

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function deg2rad(deg) { return deg * (Math.PI/180); }

module.exports = router;