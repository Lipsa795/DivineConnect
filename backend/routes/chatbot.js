const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const router = express.Router();

// ================== INIT ==================
const ai = new GoogleGenAI({}); // uses GEMINI_API_KEY from env

// ================== TEST ROUTES ==================
router.get('/test', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Chatbot route is working!',
    timestamp: new Date().toISOString()
  });
});

router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Chatbot API is running' });
});

// ================== INTENT DETECTION ==================
function detectIntent(message) {
  const msg = message.toLowerCase();

  // BOOK POOJA
  if (
    msg.includes('book') ||
    msg.includes('pooja') && (msg.includes('want') || msg.includes('need'))
  ) {
    return { intent: 'book_pooja', action: { type: 'navigate', to: '/pooja-booking' } };
  }

  // DONATE
  if (msg.includes('donate') || msg.includes('charity')) {
    return { intent: 'donate', action: { type: 'navigate', to: '/charity' } };
  }

  // SAMAGRI
  if (msg.includes('samagri') || msg.includes('pooja items')) {
    return { intent: 'order_samagri', action: { type: 'navigate', to: '/samagri' } };
  }

  // TEMPLE
  if (msg.includes('temple') && (msg.includes('near') || msg.includes('find'))) {
    return { intent: 'find_temple', action: { type: 'scroll', to: 'temples' } };
  }

  // FESTIVAL
  if (
    msg.includes('holi') ||
    msg.includes('diwali') ||
    msg.includes('shivratri') ||
    msg.includes('navratri') ||
    msg.includes('janmashtami')
  ) {
    return { intent: 'festival_info', action: null };
  }

  // PLACE
  if (msg.includes('puri') || msg.includes('varanasi') || msg.includes('tirupati')) {
    return { intent: 'sacred_place', action: null };
  }

  return { intent: 'general_question', action: null };
}

// ================== PREDEFINED ==================
function getPredefinedReply(intent) {
  switch (intent) {
    case 'book_pooja':
      return `I'll help you book a pooja! 🙏

• Griha Shanti  
• Satyanarayan  
• Rudrabhishek  
• Maha Mrityunjaya  

Click below to proceed!`;

    case 'donate':
      return `Thank you 🙏

• Temple Maintenance  
• Anna Daan  
• Education  

Click below to donate!`;

    case 'order_samagri':
      return `Order pooja items 🛍️

• Kumkum  
• Flowers  
• Agarbatti  

Click below!`;

    case 'find_temple':
      return `Find temples near you 🛕

Click below and allow location 🙏`;

    default:
      return null;
  }
}

// ================== MAIN ==================
router.post('/message', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.json({
        reply: "Please ask something 🙏",
        intent: 'general_question',
        action: null
      });
    }

    const { intent, action } = detectIntent(message);

    // PREDEFINED
    const predefined = getPredefinedReply(intent);
    if (predefined) {
      return res.json({
        reply: predefined,
        intent,
        action,
        success: true
      });
    }

    // CONTEXT
    const conversation = history
      .map(h => `${h.role}: ${h.text}`)
      .join('\n');

    let prompt = `
You are a spiritual assistant for DivineConnect.
Reply in a short, warm way (2-3 lines).

${conversation}

User: ${message}
Assistant:
`;

    if (intent === 'festival_info') {
      prompt = `
Explain this Hindu festival briefly (meaning + how celebrated).

User: ${message}
Assistant:
`;
    }

    if (intent === 'sacred_place') {
      prompt = `
Explain this sacred place briefly (importance + deity).

User: ${message}
Assistant:
`;
    }

    // ================== GEMINI ==================
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    console.log("Gemini response:", response);

    const aiReply = response.text || "Please rephrase 🙏";

    res.json({
      reply: aiReply,
      intent,
      action,
      success: true
    });

  } catch (err) {
    console.error("Chatbot error:", err.message);

    res.json({
      reply: "Namaste 🙏 I can help with pooja, temples, donations, and festivals.",
      intent: 'general_question',
      action: null
    });
  }
});

module.exports = router;