const mongoose = require('mongoose');

const memeSchema = new mongoose.Schema({
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topText: {
    type: String,
    trim: true,
    maxlength: 100
  },
  bottomText: {
    type: String,
    trim: true,
    maxlength: 100
  },
  imageUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  votes: {
    up: {
      type: Number,
      default: 0
    },
    down: {
      type: Number,
      default: 0
    }
  },
  score: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: String,
    trim: true
  }],
  isFeatured: {
    type: Boolean,
    default: false
  }
});

memeSchema.index({ score: -1 });
memeSchema.index({ createdAt: -1 });
memeSchema.index({ creator: 1 });

module.exports = mongoose.model('Meme', memeSchema);