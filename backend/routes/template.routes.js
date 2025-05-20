const express = require('express');
const router = express.Router();
const templateController = require('../controllers/template.controller');
const { protect } = require('../middleware/auth');

// Create a new template
router.post('/', protect, templateController.createTemplate);
// Get all templates (public)
router.get('/', templateController.getTemplates);


module.exports = router;
