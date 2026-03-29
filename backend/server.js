const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/charity', require('./routes/charity'));
app.use('/api/samagri', require('./routes/samagri'));
app.use('/api/temples', require('./routes/temples'));
app.use('/api/places', require('./routes/places'));
// Add this with other routes
app.use('/api/chatbot', require('./routes/chatbot')); // Add this line
// Add this route after your middleware
app.get('/', (req, res) => {
  res.json({
    message: '🕉️ DivineConnect API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      temples: '/api/temples',
      bookings: '/api/bookings',
      charity: '/api/charity',
      samagri: '/api/samagri',
      places: '/api/places'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));