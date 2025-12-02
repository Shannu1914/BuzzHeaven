const mongoose = require('mongoose');

const CallLog = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  startedAt: Date,
  endedAt: Date,
  type: { type: String, enum: ['audio','video'] },
  recordingUrl: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CallLog', CallLog);
