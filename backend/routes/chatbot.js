const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Chatbot route is working!',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Chatbot API is running' });
});

// Initialize Google GenAI
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBX4SOlQ4tFafmqPDexaab5B4yvhof8cjQ';
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Intent detection using keywords (reliable and fast)
function detectIntent(message) {
  const msg = message.toLowerCase().trim();
  
  // Booking pooja intents
  const bookKeywords = ['book', 'booking', 'want pooja', 'need pooja', 'do pooja', 'perform pooja', 'pooja booking'];
  if (bookKeywords.some(keyword => msg.includes(keyword)) || 
      (msg.includes('pooja') && (msg.includes('want') || msg.includes('need') || msg.includes('book')))) {
    return { intent: 'book_pooja', action: { type: 'navigate', to: '/pooja-booking' } };
  }
  
  // Specific pooja types
  const poojaTypes = ['griha shanti', 'satyanarayan', 'rudrabhishek', 'mrityunjaya', 'maha mrityunjaya'];
  if (poojaTypes.some(type => msg.includes(type))) {
    return { intent: 'book_pooja', action: { type: 'navigate', to: '/pooja-booking' } };
  }
  
  // Donation intents
  const donateKeywords = ['donate', 'donation', 'charity', 'give', 'contribute', 'help temple', 'support temple'];
  if (donateKeywords.some(keyword => msg.includes(keyword))) {
    return { intent: 'donate', action: { type: 'navigate', to: '/charity' } };
  }
  
  // Samagri intents
  const samagriKeywords = ['samagri', 'order', 'items', 'materials', 'kumkum', 'chandan', 'agarbatti', 'camphor', 'flowers', 'coconut', 'pooja items', 'buy items'];
  if (samagriKeywords.some(keyword => msg.includes(keyword))) {
    return { intent: 'order_samagri', action: { type: 'navigate', to: '/samagri' } };
  }
  
  // Temple finder intents
  const templeKeywords = ['nearby temple', 'temples near', 'find temple', 'search temple', 'temple location', 'temple around', 'near me'];
  if (templeKeywords.some(keyword => msg.includes(keyword)) || 
      (msg.includes('temple') && (msg.includes('near') || msg.includes('find') || msg.includes('location')))) {
    return { intent: 'find_temple', action: { type: 'scroll', to: 'temples' } };
  }
  
  // Festival intents (will use AI but mark as festival for context)
  const festivalKeywords = ['festival', 'shivaratri', 'diwali', 'ganesh', 'navratri', 'janmashtami', 'holi', 'rath yatra', 'puja'];
  if (festivalKeywords.some(keyword => msg.includes(keyword))) {
    return { intent: 'festival_info', action: null };
  }
  
  // Sacred places intents
  const sacredPlaces = ['puri', 'jagannath', 'varanasi', 'kashi', 'tirupati', 'venkateswara', 'ayodhya', 'mathura', 'dwarka', 'badrinath', 'kedarnath'];
  if (sacredPlaces.some(place => msg.includes(place))) {
    return { intent: 'sacred_place', action: null };
  }
  
  // Default - general question (will use AI)
  return { intent: 'general_question', action: null };
}

// Predefined replies for common intents (used when AI fails)
function getPredefinedReply(intent, message) {
  const msg = message.toLowerCase();
  
  switch(intent) {
    case 'book_pooja':
      return "I'll help you book a pooja! 🙏 We offer:\n\n• Griha Shanti Pooja (₹1100) - Peace and harmony in home\n• Satyanarayan Pooja (₹2100) - Prosperity and abundance\n• Rudrabhishek Pooja (₹3100) - Lord Shiva blessings\n• Maha Mrityunjaya Pooja (₹5100) - Health and longevity\n\nClick the button below to proceed to booking!";
    
    case 'donate':
      return "Thank you for your generosity! 🙏 You can donate to:\n\n• 🏛️ Temple Maintenance - Support daily rituals\n• 🍛 Food Donation (Anna Daan) - Feed devotees\n• 📚 Vedic Education - Support spiritual learning\n• 💊 Medical Aid - Help those in need\n\nClick the button below to make a difference!";
    
    case 'order_samagri':
      return "You can order these pooja essentials with doorstep delivery:\n\n🌸 Kumkum, Chandan, Agarbatti, Camphor\n🌸 Fresh Flowers, Coconut, Betel Leaves\n🌸 Incense Sticks, Haldi, Sindoor\n\nClick the button below to place your order! 🛍️";
    
    case 'find_temple':
      return "I can help you find temples near your location! 🛕\n\nClick the button below and then:\n1. Click 'Use My Current Location'\n2. Allow location access\n3. Adjust search radius\n4. Discover temples near you!\n\nMay you find divine blessings! 🙏";
    
    default:
      return null;
  }
}

// Chatbot message endpoint
router.post('/message', async (req, res) => {
  try {
    const { message, userId, history = [] } = req.body;
    
    console.log('📨 Received message:', message);
    
    if (!message || message.trim() === '') {
      return res.json({ 
        reply: "Please ask me something! 🙏",
        intent: 'general_question',
        action: null
      });
    }
    
    // First, detect intent using keywords
    const { intent, action } = detectIntent(message);
    console.log('🎯 Detected intent:', intent);
    console.log('🎬 Action:', action);
    
    // For action intents, use predefined reply (reliable and fast)
    const predefinedReply = getPredefinedReply(intent, message);
    
    if (predefinedReply) {
      // For intent that has action (navigation), return predefined reply with action
      return res.json({
        reply: predefinedReply,
        intent: intent,
        action: action,
        success: true
      });
    }
    
    // For general questions and festival info, use Gemini AI
    console.log('🤖 Calling Gemini AI for general question...');
    
    // Build prompt for Gemini
    let prompt = `You are a spiritual assistant for DivineConnect. Answer the following question in a warm, helpful, and spiritual manner. Keep responses concise (2-3 sentences max). Use Indian spiritual terminology like "Namaste", "prasadam", "darshan", etc.

User question: "${message}"

Answer:`;
    
    // Add context for festival questions
    if (intent === 'festival_info') {
      prompt = `You are a spiritual assistant. Provide information about the Hindu festival mentioned. Include significance, when it's celebrated, and how it's observed. Keep it concise (2-3 sentences).

Question: "${message}"

Answer:`;
    }
    
    if (intent === 'sacred_place') {
      prompt = `You are a spiritual assistant. Provide information about the sacred place mentioned. Include its significance, main temple/deity, and why it's important. Keep it concise (2-3 sentences).

Question: "${message}"

Answer:`;
    }
    
    // Call Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 200
      }
    });
    
    const aiReply = response.text || "I'm here to help! Could you please rephrase your question? 🙏";
    console.log('🤖 AI Reply:', aiReply.substring(0, 100));
    
    res.json({
      reply: aiReply,
      intent: intent,
      action: null,
      success: true,
      ai: true
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Fallback: try to detect intent and use predefined reply
    const { intent, action } = detectIntent(req.body.message);
    const fallbackReply = getPredefinedReply(intent, req.body.message);
    
    if (fallbackReply) {
      res.json({
        reply: fallbackReply,
        intent: intent,
        action: action,
        success: true,
        fallback: true
      });
    } else {
      res.json({
        reply: "Namaste! 🙏 I'm your DivineConnect spiritual assistant. I can help you:\n\n• 📖 Book a pooja\n• ❤️ Make a donation\n• 🌸 Order samagri\n• 🛕 Find nearby temples\n• 🎉 Learn about festivals\n• 📍 Discover sacred places\n\nWhat would you like to do today?",
        intent: 'general_question',
        action: null,
        success: true
      });
    }
  }
});

module.exports = router;