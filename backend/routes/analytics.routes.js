const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth');

router.get('/memes/:id/stats', analyticsController.getMemeStats);
router.get('/users/:id/dashboard', protect, analyticsController.getUserDashboard);

module.exports = router;