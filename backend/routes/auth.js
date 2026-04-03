const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendResetPasswordEmail } = require('../utils/emailService');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ========== PROFILE ROUTES ==========

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get profile' });
  }
});

// Update profile picture
router.put('/profile-pic', authMiddleware, async (req, res) => {
  try {
    const { profilePic } = req.body;
    
    // Validate base64 size (max 200KB)
    const sizeInBytes = Math.round((profilePic.length * 3) / 4);
    if (sizeInBytes > 200000) {
      return res.status(400).json({ message: 'Image too large. Please use a smaller image.' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { profilePic },
      { new: true }
    ).select('-password');
    
    res.json({ profilePic: user.profilePic });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile picture' });
  }
});

// Update user profile (name, etc.)
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (address) updates.address = address;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// ========== FORGOT PASSWORD ROUTES ==========

// Forgot Password - Send Reset Email
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    
    // Create reset link
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    // Send email (if email service is configured)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await sendResetPasswordEmail(email, resetLink, user.name);
      res.json({ message: 'Password reset link has been sent to your email' });
    } else {
      // For development without email
      res.json({ 
        message: `Reset link (development only): ${resetLink}`,
        devMode: true
      });
    }
    
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to send reset email. Please try again.' });
  }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset link' });
    }
    
    // Update password
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    
    res.json({ message: 'Password has been reset successfully' });
    
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

module.exports = router;