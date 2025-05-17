const memeService = require('../services/meme.service');
const { protect } = require('../middleware/auth');

exports.createMeme = async (req, res, next) => {
  try {
    const { templateId, topText, bottomText, tags } = req.body;
    
    // Assuming you have file upload middleware that sets req.files
    const imageUrl = req.files?.image?.[0]?.path;
    const thumbnailUrl = req.files?.thumbnail?.[0]?.path;
    
    if (!imageUrl || !thumbnailUrl) {
      throw new Error('Image and thumbnail are required');
    }
    
    const meme = await memeService.createMeme(
      templateId,
      req.user.id,
      topText,
      bottomText,
      imageUrl,
      thumbnailUrl,
      tags
    );
    
    res.status(201).json({
      success: true,
      data: meme
    });
  } catch (error) {
    next(error);
  }
};

exports.updateMeme = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const meme = await memeService.updateMeme(id, req.user.id, updateData);
    
    res.status(200).json({
      success: true,
      data: meme
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteMeme = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await memeService.deleteMeme(id, req.user.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

exports.getTemplates = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = 'popularity' } = req.query;
    
    const result = await memeService.getTemplates(
      parseInt(page),
      parseInt(limit),
      sort
    );
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.getMemeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const meme = await memeService.getMemeById(id);
    
    res.status(200).json({
      success: true,
      data: meme
    });
  } catch (error) {
    next(error);
  }
};

exports.getMemes = async (req, res, next) => {
  try {
    const { sort = 'new', page = 1, limit = 10 } = req.query;
    
    const result = await memeService.getMemes(
      sort,
      parseInt(page),
      parseInt(limit)
    );
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};