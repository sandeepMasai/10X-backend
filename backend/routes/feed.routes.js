const express = require('express');
const router = express.Router();
const memeController = require('../controllers/meme.controller');

router.get('/', memeController.getMemes);
// router.get('/:id', memeController.getMemeById);
// Should match exactly what your frontend calls
router.get('/api/memes/:id', memeController.getMemeById);

module.exports = router;
