const Template = require('../models/Template')

exports.createTemplate = async (req, res) => {
  try {
    const {
      name,
      imageUrl,
      thumbnailUrl,
      textAreas,
      tags
    } = req.body;

    const newTemplate = await Template.create({
      name,
      imageUrl,
      thumbnailUrl,
      textAreas,
      tags
    });

    res.status(201).json({
      success: true,
      data: newTemplate
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};


exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
