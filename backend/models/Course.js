// ============================================================
//  Mongoose Model – Course
// ============================================================
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title:         { type: String, required: true, trim: true },
    instructor:    { type: String, required: true, trim: true },
    domain:        { type: String, required: true, lowercase: true },
    domainLabel:   { type: String, required: true },
    emoji:         { type: String, default: '📚' },
    level:         { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    rating:        { type: Number, min: 0, max: 5, default: 4.5 },
    reviews:       { type: Number, default: 0 },
    students:      { type: String, default: '0' },
    duration:      { type: String, default: '0h' },
    price:         { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: null },
    badge:         { type: String, enum: ['bestseller', 'new', 'hot', 'free', null], default: null },
    tags:          [{ type: String }],
  },
  { timestamps: true }
);

// Text index for search
courseSchema.index({ title: 'text', instructor: 'text', tags: 'text', domainLabel: 'text' });

module.exports = mongoose.model('Course', courseSchema);
