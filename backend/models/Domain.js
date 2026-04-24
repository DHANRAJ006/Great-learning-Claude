// ============================================================
//  Mongoose Model – Domain
// ============================================================
const mongoose = require('mongoose');

const domainSchema = new mongoose.Schema(
  {
    domainId: { type: String, required: true, unique: true, lowercase: true },
    name:     { type: String, required: true },
    emoji:    { type: String, default: '📂' },
    count:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Domain', domainSchema);
