const express = require('express');
const axios = require('axios');
const router = express.Router();

const YOUTUBE_API_KEY = 'AIzaSyBHqcpSS8VgewPRcrMNUTMZmLE2ibTTG9Y';

// Search for live streams
router.get('/live', async (req, res) => {
  try {
    const { query = 'temple aarti live' } = req.query;
    
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        eventType: 'live',
        maxResults: 20,
        key: YOUTUBE_API_KEY
      }
    });
    
    const videoIds = response.data.items.map(item => item.id.videoId).join(',');
    
    const detailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'statistics,contentDetails,liveStreamingDetails',
        id: videoIds,
        key: YOUTUBE_API_KEY
      }
    });
    
    const videos = response.data.items.map(item => {
      const details = detailsResponse.data.items.find(d => d.id === item.id.videoId);
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high.url,
        viewCount: details?.statistics?.viewCount || '0',
        duration: details?.contentDetails?.duration,
        isLive: true,
        concurrentViewers: details?.liveStreamingDetails?.concurrentViewers || 'N/A'
      };
    });
    
    res.json({ success: true, videos });
  } catch (error) {
    console.error('YouTube API error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Search for bhajans
router.get('/bhajans', async (req, res) => {
  try {
    const { query = 'hindu bhajan aarti' } = req.query;
    
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: 24,
        order: 'viewCount',
        key: YOUTUBE_API_KEY
      }
    });
    
    const videoIds = response.data.items.map(item => item.id.videoId).join(',');
    
    const detailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'statistics,contentDetails',
        id: videoIds,
        key: YOUTUBE_API_KEY
      }
    });
    
    const videos = response.data.items.map(item => {
      const details = detailsResponse.data.items.find(d => d.id === item.id.videoId);
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high.url,
        viewCount: details?.statistics?.viewCount || '0',
        duration: details?.contentDetails?.duration
      };
    });
    
    res.json({ success: true, videos });
  } catch (error) {
    console.error('YouTube API error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'YouTube API route is working!' });
});

module.exports = router;