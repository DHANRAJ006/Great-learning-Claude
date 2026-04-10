// ============================================================
//  Controller – Courses
// ============================================================
const Course        = require('../models/Course');
const { createError } = require('../middleware/errorHandler');

// GET /api/courses
exports.getAllCourses = async (req, res, next) => {
  try {
    const { domain, level, sort, badge } = req.query;
    const filter = {};

    if (domain) filter.domain = domain.toLowerCase();
    if (level)  filter.level  = level.toLowerCase();
    if (badge)  filter.badge  = badge.toLowerCase();

    let query = Course.find(filter);

    switch (sort) {
      case 'newest':    query = query.sort({ createdAt: -1 }); break;
      case 'rating':    query = query.sort({ rating: -1 });    break;
      case 'price-low': query = query.sort({ price: 1 });      break;
      default:          query = query.sort({ reviews: -1 });   break; // popular
    }

    const courses = await query.lean();
    res.json({ success: true, count: courses.length, data: courses });
  } catch (err) {
    next(err);
  }
};

// GET /api/courses/:id
exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).lean();
    if (!course) return next(createError(404, 'Course not found'));
    res.json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};
