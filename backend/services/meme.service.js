const Meme = require('../models/Meme');
const Template = require('../models/Template');
const User = require('../models/User');
const Vote = require('../models/Vote');
const Comment = require('../models/Comment');

exports.createMeme = async (templateId, creatorId, topText, bottomText, imageUrl, thumbnailUrl, tags) => {
  const template = await Template.findById(templateId);
  if (!template) {
    throw new Error('Template not found');
  }

  const meme = await Meme.create({
    template: templateId,
    creator: creatorId,
    topText,
    bottomText,
    imageUrl,
    thumbnailUrl,
    tags
  });

  // Update template popularity
  template.popularity += 1;
  await template.save();

  // Update user's meme count
  await User.findByIdAndUpdate(creatorId, { $inc: { memesCreated: 1 } });

  return meme;
};

exports.updateMeme = async (memeId, userId, updateData) => {
  const meme = await Meme.findOne({ _id: memeId, creator: userId });
  
  if (!meme) {
    throw new Error('Meme not found or not authorized');
  }

  Object.keys(updateData).forEach(key => {
    meme[key] = updateData[key];
  });

  meme.updatedAt = Date.now();
  await meme.save();
  
  return meme;
};

exports.deleteMeme = async (memeId, userId) => {
  const meme = await Meme.findOne({ _id: memeId, creator: userId });
  
  if (!meme) {
    throw new Error('Meme not found or not authorized');
  }

  await meme.remove();

  // Update user's meme count
  await User.findByIdAndUpdate(userId, { $inc: { memesCreated: -1 } });

  // Clean up related data
  await Vote.deleteMany({ meme: memeId });
  await Comment.deleteMany({ meme: memeId });

  return true;
};

exports.getTemplates = async (page = 1, limit = 10, sort = 'popularity') => {
  const skip = (page - 1) * limit;
  
  const templates = await Template.find()
    .sort({ [sort]: -1 })
    .skip(skip)
    .limit(limit);
    
  const total = await Template.countDocuments();
  
  return {
    templates,
    page,
    pages: Math.ceil(total / limit),
    total
  };
};

exports.getMemeById = async (memeId) => {
  const meme = await Meme.findById(memeId)
    .populate('creator', 'username avatar')
    .populate('template', 'name');
    
  if (!meme) {
    throw new Error('Meme not found');
  }
  
  // Increment views
  meme.views += 1;
  await meme.save();
  
  return meme;
};

exports.getMemes = async (sort = 'new', page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  let sortOption = {};
  
  switch (sort) {
    case 'new':
      sortOption = { createdAt: -1 };
      break;
    case 'top_day':
      sortOption = { score: -1 };
      break;
    case 'top_week':
      sortOption = { score: -1 };
      break;
    case 'all_time':
      sortOption = { score: -1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }
  
  let query = {};
  
  if (sort === 'top_day') {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    query.createdAt = { $gte: oneDayAgo };
  } else if (sort === 'top_week') {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    query.createdAt = { $gte: oneWeekAgo };
  }
  
  const memes = await Meme.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
    .populate('creator', 'username avatar');
    
  const total = await Meme.countDocuments(query);
  
  return {
    memes,
    page,
    pages: Math.ceil(total / limit),
    total
  };
};