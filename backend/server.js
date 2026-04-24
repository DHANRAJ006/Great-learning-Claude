// ============================================================
//  LearnFlow – Express Entry Point
//  server/server.js
// ============================================================

require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const mongoose  = require('mongoose');

const courseRoutes      = require('./routes/courses');
const liveRoutes        = require('./routes/liveSessions');
const domainRoutes      = require('./routes/domains');
const userRoutes        = require('./routes/user');
const { errorHandler }  = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────
app.use(cors({ 
  origin: process.env.FRONTEND_URL || true, 
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Request logger (dev only) ──────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// ── Routes ─────────────────────────────────────────────────
app.use('/api/courses',  courseRoutes);
app.use('/api/live',     liveRoutes);
app.use('/api/domains',  domainRoutes);
app.use('/api/user',     userRoutes);

// ── Health check ────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ── Search (cross-collection) ────────────────────────────────
const Course      = require('./models/Course');
const LiveSession = require('./models/LiveSession');
const Domain      = require('./models/Domain');

app.get('/api/search', async (req, res, next) => {
  try {
    const q = req.query.q?.trim();
    if (!q || q.length < 2) return res.json([]);

    const regex = new RegExp(q, 'i');

    const [courses, sessions, domains] = await Promise.all([
      Course.find({
        $or: [{ title: regex }, { instructor: regex }, { domainLabel: regex }],
      }).limit(5).select('title instructor domainLabel emoji'),

      LiveSession.find({
        $or: [{ title: regex }, { instructor: regex }, { topicLabel: regex }],
      }).limit(4).select('title instructor topicLabel status startTime instructorInitial'),

      Domain.find({ $or: [{ name: regex }] }).limit(3).select('name emoji count'),
    ]);

    const results = [
      ...courses.map(c  => ({ type: 'course', id: c._id, title: c.title, sub: `${c.instructor} · ${c.domainLabel}`, emoji: c.emoji, page: 'courses' })),
      ...sessions.map(s => ({ type: 'live',   id: s._id, title: s.title, sub: `${s.instructor} · ${s.status === 'live' ? '🔴 Live Now' : s.startTime}`, emoji: s.instructorInitial, page: 'live' })),
      ...domains.map(d  => ({ type: 'domain', id: d._id, title: d.name,  sub: `${d.count} courses`, emoji: d.emoji, page: 'courses' })),
    ];

    res.json(results);
  } catch (err) {
    next(err);
  }
});

// ── 404 ─────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ── Error handler ────────────────────────────────────────────
app.use(errorHandler);

// ── DB + Server boot ─────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`✅ MongoDB connected → ${process.env.MONGO_URI}`);
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
