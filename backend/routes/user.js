// server/routes/user.js
const express = require('express');
const router  = express.Router();
const User    = require('../models/User');

// GET /api/user/me  — returns mock logged-in user
router.get('/me', async (_req, res, next) => {
  try {
    let user = await User.findOne().lean();
    if (!user) return res.status(404).json({ success: false, message: 'No user found' });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});

// POST /api/user/login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // Allow login by either name (username) or email
    const user = await User.findOne({ 
      $or: [{ name: username }, { email: username }] 
    }).lean();
    
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
    
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});

// POST /api/user/signup
router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});

module.exports = router;
