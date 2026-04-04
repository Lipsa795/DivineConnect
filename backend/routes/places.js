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

// ✅ NEW: Search for place photo by query
router.get('/search-photo', async (req, res) => {
  try {
    const { query } = req.query;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Google API key not configured' });
    }
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    // First search for the place using text search
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json`;
    const searchResponse = await axios.get(searchUrl, {
      params: {
        query: query,
        key: apiKey
      }
    });
    
    if (searchResponse.data.results && searchResponse.data.results.length > 0) {
      const place = searchResponse.data.results[0];
      
      // Check if the place has photos
      if (place.photos && place.photos.length > 0) {
        const photoReference = place.photos[0].photo_reference;
        const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;
        
        res.json({ 
          success: true,
          photoUrl: photoUrl,
          placeName: place.name,
          placeId: place.place_id
        });
      } else {
        // No photos available for this place
        res.json({ 
          success: false, 
          photoUrl: null,
          message: 'No photos available for this place'
        });
      }
    } else {
      res.json({ 
        success: false, 
        photoUrl: null,
        message: 'Place not found'
      });
    }
  } catch (error) {
    console.error('Search photo error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to search place photo',
      message: error.message
    });
  }
});

// ✅ NEW: Get photo by reference (alternative method)
router.get('/photo', async (req, res) => {
  try {
    const { photoreference, maxwidth = 400 } = req.query;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    if (!photoreference) {
      return res.status(400).json({ error: 'Photoreference is required' });
    }
    
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photoreference=${photoreference}&key=${apiKey}`;
    
    // Redirect to the actual photo URL
    res.redirect(photoUrl);
  } catch (error) {
    console.error('Photo API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch photo' });
  }
});

module.exports = router;