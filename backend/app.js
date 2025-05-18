const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

connectDB();

// Route files
const authRoutes = require('./routes/auth.routes');
const memeRoutes = require('./routes/meme.routes');
const feedRoutes = require('./routes/feed.routes');
const interactionRoutes = require('./routes/interaction.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const leaderboardRoutes = require('./routes/leaderboard.routes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/memes', memeRoutes);
app.use('/api/memes', feedRoutes);
app.use('/api/memes', interactionRoutes);
app.use('/api', analyticsRoutes);
app.use('/api', leaderboardRoutes);

// Error handler middleware
app.use(errorHandler);

module.exports = app;