// server/routes/user.js
const express = require('express');
const router  = express.Router();
const User    = require('../models/User');

// GET /api/user/me  — returns mock logged-in user
router.get('/me', async (_req, res, next) => {
  try {
    // Return the first user in DB (mock auth)
    let user = await User.findOne().lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user found. Run seed.js first.' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
