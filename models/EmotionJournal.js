const mongoose = require('mongoose');

const EmotionJournalSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  entries: [
    {
      timestamp: { type: Date, default: Date.now },
      emotion: { type: String, required: true },
      intensity: { type: Number, min: 1, max: 10, required: true },
      notes: { type: String, maxlength: 500 },
      triggers: [String], // External events or factors
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

EmotionJournalSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('EmotionJournal', EmotionJournalSchema);
