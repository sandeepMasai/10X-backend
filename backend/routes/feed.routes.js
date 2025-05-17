const express = require('express');
const router = express.Router();
const memeController = require('../controllers/meme.controller');

router.get('/', memeController.getMemes);
router.get('/:id', memeController.getMemeById);

module.exports = router;