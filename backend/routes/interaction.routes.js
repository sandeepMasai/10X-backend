const express = require('express');
const router = express.Router();
const voteController = require('../controllers/vote.controller');
const commentController = require('../controllers/comment.controller');
const { protect } = require('../middleware/auth');

router.post('/:id/vote', protect, voteController.voteMeme);
router.post('/:id/comment', protect, commentController.commentMeme);
router.post('/:id/report', protect, commentController.reportMeme);

module.exports = router;