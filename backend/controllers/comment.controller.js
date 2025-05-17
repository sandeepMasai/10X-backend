const Comment = require('../models/Comment');
const Meme = require('../models/Meme');
const { protect } = require('../middleware/auth');
const Report =require("../models/Report")

exports.commentMeme = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      throw new Error('Comment text is required');
    }
    
    // Check if meme exists
    const meme = await Meme.findById(id);
    if (!meme) {
      throw new Error('Meme not found');
    }
    
    const comment = await Comment.create({
      user: req.user.id,
      meme: id,
      text
    });
    
    // Update meme comments count
    meme.commentsCount += 1;
    await meme.save();
    
    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    next(error);
  }
};


exports.reportMeme = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason, description } = req.body;

    // Validate meme exists
    const meme = await Meme.findById(id);
    if (!meme) {
      throw new Error('Meme not found');
    }

    // Check if user already reported this meme
    const existingReport = await Report.findOne({
      user: req.user.id,
      meme: id
    });

    if (existingReport) {
      throw new Error('You have already reported this meme');
    }

    const report = await Report.create({
      user: req.user.id,
      meme: id,
      reason,
      description,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};