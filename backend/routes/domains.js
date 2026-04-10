// server/routes/domains.js
const express = require('express');
const router  = express.Router();
const { getAllDomains } = require('../controllers/domainController');

router.get('/', getAllDomains);

module.exports = router;
