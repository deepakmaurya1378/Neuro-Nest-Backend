// models/Session.js
const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  therapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointmentDate: { type: Date, required: true },
  sessionNotes: {
    privateNotes: { type: Object, maxlength: 500 },
    sharedNotes: { type: String, maxlength: 500 },
  },
  status: { type: String, enum: ['requested', 'approved', 'completed'], default: 'requested' },
  createdAt: { type: Date, default: Date.now },
});

SessionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Session', SessionSchema);
