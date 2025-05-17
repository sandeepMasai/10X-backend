const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboard.controller');

router.get('/leaderboard/week', leaderboardController.getWeeklyLeaderboard);
router.get('/highlight/meme-of-the-day', leaderboardController.getMemeOfTheDay);

module.exports = router;