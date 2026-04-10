// ============================================================
//  Mongoose Model – LiveSession
// ============================================================
const mongoose = require('mongoose');

const liveSessionSchema = new mongoose.Schema(
  {
    title:              { type: String, required: true, trim: true },
    instructor:         { type: String, required: true },
    instructorInitial:  { type: String, required: true, maxlength: 3 },
    topic:              { type: String, required: true, lowercase: true },
    topicLabel:         { type: String, required: true },
    level:              { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    status:             { type: String, enum: ['live', 'upcoming', 'ended'], default: 'upcoming' },
    startTime:          { type: String, required: true },
    duration:           { type: String, required: true },
    viewers:            { type: Number, default: 0 },
    enrolled:           { type: Number, default: 0 },
    tags:               [{ type: String }],
    overview:           { type: String, required: true },
    topics:             [{ type: String }],
    insights:           [{ type: String }],
  },
  { timestamps: true }
);

liveSessionSchema.index({ title: 'text', instructor: 'text', topicLabel: 'text' });

module.exports = mongoose.model('LiveSession', liveSessionSchema);
