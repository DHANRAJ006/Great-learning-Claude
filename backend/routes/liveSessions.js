// server/routes/liveSessions.js
const express = require('express');
const router  = express.Router();
const { getAllSessions, getSessionById } = require('../controllers/liveController');

router.get('/',    getAllSessions);
router.get('/:id', getSessionById);

module.exports = router;
