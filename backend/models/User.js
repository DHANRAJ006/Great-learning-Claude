// ============================================================
//  Mongoose Model – User
// ============================================================
const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  emoji:        { type: String },
  title:        { type: String, required: true },
  instructor:   { type: String },
  date:         { type: String },
  credentialId: { type: String },
});

const progressSchema = new mongoose.Schema({
  courseId:   { type: String },
  emoji:      { type: String },
  title:      { type: String },
  instructor: { type: String },
  progress:   { type: Number, min: 0, max: 100, default: 0 },
});

const userSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true },
    password:     { type: String, required: true },
    plan:         { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
    avatarSeed:   { type: String, default: 'learnflow' },
    overallProgress: { type: Number, min: 0, max: 100, default: 0 },
    certificates: [certificateSchema],
    inProgress:   [progressSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
