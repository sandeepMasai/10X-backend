const analyticsService = require('../services/analytics.service');
const { protect } = require('../middleware/auth');

exports.getMemeStats = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const stats = await analyticsService.getMemeStats(id);
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserDashboard = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Only allow users to access their own dashboard unless admin
    if (req.user.id !== id && req.user.role !== 'admin') {
      throw new Error('Not authorized to access this dashboard');
    }
    
    const dashboard = await analyticsService.getUserDashboard(id);
    
    res.status(200).json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    next(error);
  }
};