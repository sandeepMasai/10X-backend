const User = require('../models/User');
const { generateToken } = require('../config/jwt');

exports.register = async (username, email, password) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('User already exists');
  }

  const user = await User.create({
    username,
    email,
    password
  });

  const token = generateToken(user._id);
  
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    token
  };
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user._id);
  
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    token
  };
};

exports.getMe = async (userId) => {
  const user = await User.findById(userId).select('-password');
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
};