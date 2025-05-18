const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./backend/config/db');
const errorHandler = require('./backend/middleware/error');

connectDB();

// Route files
const authRoutes = require('./backend/routes/auth.routes');
const memeRoutes = require('./backend/routes/meme.routes');
const feedRoutes = require('./backend/routes/feed.routes');
const interactionRoutes = require('./backend/routes/interaction.routes');
const analyticsRoutes = require('./backend/routes/analytics.routes');
const leaderboardRoutes = require('./backend/routes/leaderboard.routes');

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