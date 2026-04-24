// ============================================================
//  Controller – Domains
// ============================================================
const Domain = require('../models/Domain');

// GET /api/domains
exports.getAllDomains = async (_req, res, next) => {
  try {
    const domains = await Domain.find().sort({ count: -1 }).lean();
    res.json({ success: true, count: domains.length, data: domains });
  } catch (err) {
    next(err);
  }
};
