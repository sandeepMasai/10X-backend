const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  meme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meme',
    required: true
  },
  value: {
    type: Number,
    enum: [1, -1],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

voteSchema.index({ user: 1, meme: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);