const express = require('express');
const axios = require('axios');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// In-memory storage for rides
let rides = [
  {
    _id: '1',
    from: 'Delhi',
    to: 'Haridwar',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '08:00',
    seats: 3,
    price: 300,
    vehicle: 'car',
    description: 'Comfortable AC car, leaving from Connaught Place',
    userId: 'demo',
    userName: 'Rajesh K.',
    userRating: 4.8,
    contact: '9876543210'
  },
  {
    _id: '2',
    from: 'Mumbai',
    to: 'Shirdi',
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    time: '06:00',
    seats: 2,
    price: 500,
    vehicle: 'auto',
    description: 'Shared auto, leaving from Dadar',
    userId: 'demo2',
    userName: 'Priya M.',
    userRating: 4.5,
    contact: '9876543211'
  }
];

// Get all rides
router.get('/rides', async (req, res) => {
  res.json(rides);
});

// Get single ride
router.get('/rides/:id', async (req, res) => {
  const ride = rides.find(r => r._id === req.params.id);
  if (ride) {
    res.json(ride);
  } else {
    res.status(404).json({ error: 'Ride not found' });
  }
});

// Post a new ride
router.post('/rides', authMiddleware, async (req, res) => {
  const newRide = {
    _id: Date.now().toString(),
    ...req.body,
    userId: req.userId,
    userName: req.user?.name || 'Devotee',
    contact: req.body.contact || 'Not provided',
    createdAt: new Date()
  };
  rides.unshift(newRide);
  res.status(201).json(newRide);
});

// Request to join a ride
router.post('/rides/:id/request', authMiddleware, async (req, res) => {
  const ride = rides.find(r => r._id === req.params.id);
  if (!ride) {
    return res.status(404).json({ error: 'Ride not found' });
  }
  
  if (ride.seats <= 0) {
    return res.status(400).json({ error: 'No seats available' });
  }
  
  res.json({ 
    message: `Request sent to ${ride.userName} (${ride.contact}). They will contact you soon.`,
    ride: ride
  });
});

// Calculate fare using Google Maps
router.get('/fare', async (req, res) => {
  try {
    const { pickup, dropoff, type = 'cab' } = req.query;
    const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
    
    if (!pickup || !dropoff) {
      return res.status(400).json({ error: 'Pickup and dropoff locations are required' });
    }
    
    // Geocode pickup
    const pickupGeo = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: { address: pickup, key: GOOGLE_API_KEY }
    });
    
    // Geocode dropoff
    const dropoffGeo = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: { address: dropoff, key: GOOGLE_API_KEY }
    });
    
    if (!pickupGeo.data.results?.[0] || !dropoffGeo.data.results?.[0]) {
      return res.status(400).json({ error: 'Location not found' });
    }
    
    const origin = `${pickupGeo.data.results[0].geometry.location.lat},${pickupGeo.data.results[0].geometry.location.lng}`;
    const destination = `${dropoffGeo.data.results[0].geometry.location.lat},${dropoffGeo.data.results[0].geometry.location.lng}`;
    
    // Get distance matrix
    const distanceRes = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json`, {
      params: {
        origins: origin,
        destinations: destination,
        key: GOOGLE_API_KEY
      }
    });
    
    const element = distanceRes.data.rows[0]?.elements[0];
    if (!element || element.status !== 'OK') {
      return res.status(400).json({ error: 'Could not calculate distance' });
    }
    
    const distanceKm = element.distance.value / 1000;
    const duration = element.duration.text;
    
    const rates = {
      cab: { base: 50, perKm: 15 },
      auto: { base: 30, perKm: 12 },
      bike: { base: 20, perKm: 8 }
    };
    
    const rate = rates[type] || rates.cab;
    const fare = Math.round(rate.base + (distanceKm * rate.perKm));
    
    res.json({
      distance: element.distance.text,
      duration: duration,
      fare: fare,
      pickup: pickupGeo.data.results[0].formatted_address,
      dropoff: dropoffGeo.data.results[0].formatted_address,
      distanceKm: distanceKm.toFixed(1)
    });
    
  } catch (error) {
    console.error('Fare calculation error:', error.message);
    res.status(500).json({ error: 'Failed to calculate fare' });
  }
});

// Search hotels using Google Places API
router.get('/hotels', async (req, res) => {
  try {
    const { lat, lng, radius = 5000, keyword = '' } = req.query;
    const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
      params: {
        location: `${lat},${lng}`,
        radius: radius,
        type: 'lodging',
        keyword: keyword,
        key: GOOGLE_API_KEY
      },
      timeout: 15000
    });
    
    // Add photo URLs to results
    const hotels = (response.data.results || []).map(hotel => ({
      ...hotel,
      photo_url: hotel.photos && hotel.photos[0] ? 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${hotel.photos[0].photo_reference}&key=${GOOGLE_API_KEY}` : null
    }));
    
    res.json(hotels);
    
  } catch (error) {
    console.error('Hotel search error:', error.message);
    res.json([]);
  }
});

// Autocomplete for locations
router.get('/autocomplete', async (req, res) => {
  try {
    const { input } = req.query;
    const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
    
    if (!input || input.length < 2) {
      return res.json([]);
    }
    
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
      params: {
        input: input,
        types: 'geocode|establishment',
        key: GOOGLE_API_KEY
      }
    });
    
    res.json(response.data.predictions || []);
    
  } catch (error) {
    console.error('Autocomplete error:', error.message);
    res.json([]);
  }
});

module.exports = router;