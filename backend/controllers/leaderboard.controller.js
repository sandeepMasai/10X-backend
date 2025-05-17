const analyticsService = require('../services/analytics.service');

exports.getWeeklyLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await analyticsService.getWeeklyLeaderboard();
    
    res.status(200).json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    next(error);
  }
};

exports.getMemeOfTheDay = async (req, res, next) => {
  try {
    const meme = await analyticsService.getMemeOfTheDay();
    
    res.status(200).json({
      success: true,
      data: meme
    });
  } catch (error) {
    next(error);
  }
};