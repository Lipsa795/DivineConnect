const express = require('express');
const axios = require('axios');
const router = express.Router();

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Ola Maps API routes are working!',
    googleApiConfigured: !!GOOGLE_API_KEY
  });
});

// Reverse Geocode using OpenStreetMap (Free & Reliable)
router.get('/reverse-geocode', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
      params: {
        lat: lat,
        lon: lng,
        format: 'json',
        addressdetails: 1
      },
      headers: { 'User-Agent': 'DivineConnect/1.0' },
      timeout: 10000
    });
    
    res.json({
      results: [{
        formatted_address: response.data.display_name,
        geometry: { location: { lat: parseFloat(lat), lng: parseFloat(lng) } }
      }]
    });
    
  } catch (error) {
    console.error('Reverse geocode error:', error.message);
    res.status(500).json({ error: 'Failed to reverse geocode' });
  }
});

// Geocode using Google Maps API
router.get('/geocode', async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }
    
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        address: address,
        key: GOOGLE_API_KEY
      }
    });
    
    if (response.data.results && response.data.results.length > 0) {
      res.json({
        results: [{
          formatted_address: response.data.results[0].formatted_address,
          geometry: {
            location: response.data.results[0].geometry.location
          }
        }]
      });
    } else {
      res.status(404).json({ error: 'Location not found' });
    }
    
  } catch (error) {
    console.error('Geocode error:', error.message);
    res.status(500).json({ error: 'Failed to geocode address' });
  }
});

// Autocomplete - Search suggestions using Google Places API
router.get('/autocomplete', async (req, res) => {
  try {
    const { input } = req.query;
    
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

// Nearby Search for Hotels using Google Places API
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 5000, type = 'lodging', keyword = '' } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
      params: {
        location: `${lat},${lng}`,
        radius: radius,
        type: type,
        keyword: keyword,
        key: GOOGLE_API_KEY
      },
      timeout: 15000
    });
    
    // Add photo URLs to results
    const results = (response.data.results || []).map(place => ({
      ...place,
      photo_url: place.photos && place.photos[0] ? 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}` : null
    }));
    
    res.json({ results: results });
    
  } catch (error) {
    console.error('Nearby search error:', error.message);
    res.json({ results: [] });
  }
});

// Text Search using Google Places API
router.get('/search', async (req, res) => {
  try {
    const { query, location, radius = 5000 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    const params = {
      query: query,
      key: GOOGLE_API_KEY
    };
    
    if (location) params.location = location;
    if (radius) params.radius = radius;
    
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json`, {
      params: params,
      timeout: 15000
    });
    
    const results = (response.data.results || []).map(place => ({
      ...place,
      photo_url: place.photos && place.photos[0] ? 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}` : null
    }));
    
    res.json({ results: results });
    
  } catch (error) {
    console.error('Search error:', error.message);
    res.json({ results: [] });
  }
});

// Distance Matrix using Google Maps API
router.get('/distance-matrix', async (req, res) => {
  try {
    const { origins, destinations } = req.query;
    
    if (!origins || !destinations) {
      return res.status(400).json({ error: 'Origins and destinations are required' });
    }
    
    const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json`, {
      params: {
        origins: origins,
        destinations: destinations,
        key: GOOGLE_API_KEY
      }
    });
    
    res.json(response.data);
    
  } catch (error) {
    console.error('Distance matrix error:', error.message);
    res.status(500).json({ error: 'Failed to calculate distance' });
  }
});

// Place Details using Google Places API
router.get('/details', async (req, res) => {
  try {
    const { place_id } = req.query;
    
    if (!place_id) {
      return res.status(400).json({ error: 'Place ID is required' });
    }
    
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
      params: {
        place_id: place_id,
        fields: 'name,formatted_address,formatted_phone_number,rating,website,photos,opening_hours,vicinity',
        key: GOOGLE_API_KEY
      }
    });
    
    const result = response.data.result;
    if (result && result.photos && result.photos[0]) {
      result.photo_url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${result.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`;
    }
    
    res.json({ result: result });
    
  } catch (error) {
    console.error('Place details error:', error.message);
    res.status(500).json({ error: 'Failed to get place details' });
  }
});

module.exports = router;