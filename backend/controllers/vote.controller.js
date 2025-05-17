const Vote = require('../models/Vote');
const Meme = require('../models/Meme');
const { protect } = require('../middleware/auth');

exports.voteMeme = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { value } = req.body;
    
    if (![1, -1].includes(value)) {
      throw new Error('Invalid vote value');
    }
    
    // Check if meme exists
    const meme = await Meme.findById(id);
    if (!meme) {
      throw new Error('Meme not found');
    }
    
    // Check if user already voted
    const existingVote = await Vote.findOne({
      user: req.user.id,
      meme: id
    });
    
    if (existingVote) {
      // If same vote, remove it
      if (existingVote.value === value) {
        await existingVote.remove();
        
        // Update meme score
        meme.votes[value === 1 ? 'up' : 'down'] -= 1;
        meme.score = meme.votes.up - meme.votes.down;
        await meme.save();
        
        return res.status(200).json({
          success: true,
          data: { action: 'removed' }
        });
      }
      
      // If different vote, update it
      const prevValue = existingVote.value;
      existingVote.value = value;
      await existingVote.save();
      
      // Update meme score
      meme.votes[prevValue === 1 ? 'up' : 'down'] -= 1;
      meme.votes[value === 1 ? 'up' : 'down'] += 1;
      meme.score = meme.votes.up - meme.votes.down;
      await meme.save();
      
      return res.status(200).json({
        success: true,
        data: { action: 'updated' }
      });
    }
    
    // Create new vote
    const vote = await Vote.create({
      user: req.user.id,
      meme: id,
      value
    });
    
    // Update meme score
    meme.votes[value === 1 ? 'up' : 'down'] += 1;
    meme.score = meme.votes.up - meme.votes.down;
    await meme.save();
    
    res.status(201).json({
      success: true,
      data: { action: 'created' }
    });
  } catch (error) {
    next(error);
  }
};