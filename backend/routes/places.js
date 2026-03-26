const express = require('express');
const axios = require('axios');
const router = express.Router();

// Google Places API proxy endpoint
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius, type, keyword } = req.query;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Google API key not configured' });
    }
    
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
    const response = await axios.get(url, {
      params: {
        location: `${lat},${lng}`,
        radius: radius || 5000,
        type: type || 'hindu_temple',
        keyword: keyword || 'temple',
        key: apiKey
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Google Places API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch places' });
  }
});

// Get place details
router.get('/details', async (req, res) => {
  try {
    const { place_id } = req.query;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    const url = `https://maps.googleapis.com/maps/api/place/details/json`;
    const response = await axios.get(url, {
      params: {
        place_id: place_id,
        fields: 'name,formatted_address,formatted_phone_number,website,opening_hours,photos,rating,reviews,user_ratings_total,price_level',
        key: apiKey
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Google Places Details API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch place details' });
  }
});

// Reverse geocoding
router.get('/geocode', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    const url = `https://maps.googleapis.com/maps/api/geocode/json`;
    const response = await axios.get(url, {
      params: {
        latlng: `${lat},${lng}`,
        key: apiKey
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Geocoding API error:', error.message);
    res.status(500).json({ error: 'Failed to get location name' });
  }
});

module.exports = router;