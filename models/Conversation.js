// server/models/Conversation.js
const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  text: String,
  emotions: Object,
  dominantEmotion: String,
  intensity: String,
  riskLevel: { type: String, default: 'low' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Conversation', ConversationSchema);
