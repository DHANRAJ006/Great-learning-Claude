// ============================================================
//  Controller – Live Sessions
// ============================================================
const LiveSession   = require('../models/LiveSession');
const { createError } = require('../middleware/errorHandler');

// GET /api/live
exports.getAllSessions = async (req, res, next) => {
  try {
    const { topic, level, status } = req.query;
    const filter = {};

    if (topic)  filter.topicLabel = { $regex: new RegExp(topic, 'i') };
    if (level)  filter.level      = level.toLowerCase();
    if (status) filter.status     = status.toLowerCase();

    const sessions = await LiveSession.find(filter)
      .sort({ status: 1, createdAt: -1 }) // 'live' sorts before 'upcoming'
      .lean();

    res.json({ success: true, count: sessions.length, data: sessions });
  } catch (err) {
    next(err);
  }
};

// GET /api/live/:id
exports.getSessionById = async (req, res, next) => {
  try {
    const session = await LiveSession.findById(req.params.id).lean();
    if (!session) return next(createError(404, 'Session not found'));
    res.json({ success: true, data: session });
  } catch (err) {
    next(err);
  }
};
