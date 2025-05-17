const express = require('express');
const router = express.Router();
const memeController = require('../controllers/meme.controller');
const { protect } = require('../middleware/auth');
const upload = require('../utils/upload');

router.post('/', protect, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), memeController.createMeme);

router.put('/:id', protect, memeController.updateMeme);
router.delete('/:id', protect, memeController.deleteMeme);
router.get('/templates', memeController.getTemplates);

module.exports = router;