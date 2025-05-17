const Meme = require('../models/Meme');
const User = require('../models/User');
const Vote = require('../models/Vote');
const Comment = require('../models/Comment');

exports.getMemeStats = async (memeId) => {
  const meme = await Meme.findById(memeId);
  if (!meme) {
    throw new Error('Meme not found');
  }

  const votes = await Vote.aggregate([
    { $match: { meme: meme._id } },
    {
      $group: {
        _id: '$value',
        count: { $sum: 1 }
      }
    }
  ]);

  const comments = await Comment.find({ meme: meme._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'username avatar');

  const upVotes = votes.find(v => v._id === 1)?.count || 0;
  const downVotes = votes.find(v => v._id === -1)?.count || 0;

  return {
    views: meme.views,
    upVotes,
    downVotes,
    score: meme.score,
    comments: comments.length,
    recentComments: comments
  };
};

exports.getUserDashboard = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const memes = await Meme.find({ creator: userId })
    .sort({ createdAt: -1 })
    .limit(5);

  const totalMemes = await Meme.countDocuments({ creator: userId });
  const totalVotes = await Vote.countDocuments({ user: userId });
  const totalComments = await Comment.countDocuments({ user: userId });

  const recentActivity = await Promise.all([
    Vote.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('meme', 'imageUrl'),
    Comment.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('meme', 'imageUrl')
  ]);

  return {
    user: {
      username: user.username,
      avatar: user.avatar,
      points: user.points,
      memesCreated: user.memesCreated
    },
    stats: {
      totalMemes,
      totalVotes,
      totalComments
    },
    recentMemes: memes,
    recentActivity: [...recentActivity[0], ...recentActivity[1]]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
  };
};

exports.getWeeklyLeaderboard = async () => {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Top memes of the week
  const topMemes = await Meme.find({ createdAt: { $gte: oneWeekAgo } })
    .sort({ score: -1 })
    .limit(10)
    .populate('creator', 'username avatar');

  // Top creators of the week
  const topCreators = await Meme.aggregate([
    { $match: { createdAt: { $gte: oneWeekAgo } } },
    { $group: { _id: '$creator', count: { $sum: 1 }, totalScore: { $sum: '$score' } } },
    { $sort: { totalScore: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    { $project: { 'user.password': 0 } }
  ]);

  return {
    topMemes,
    topCreators
  };
};

exports.getMemeOfTheDay = async () => {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const meme = await Meme.findOne({ createdAt: { $gte: yesterday } })
    .sort({ score: -1 })
    .populate('creator', 'username avatar')
    .populate('template', 'name');
    
  if (!meme) {
    // Fallback to random meme if no memes created today
    const count = await Meme.countDocuments();
    const random = Math.floor(Math.random() * count);
    return await Meme.findOne().skip(random)
      .populate('creator', 'username avatar')
      .populate('template', 'name');
  }
  
  return meme;
};