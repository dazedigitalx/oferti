require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');
const morgan = require('morgan');
const helmet = require('helmet');
const channelRouter = require('./routes/channelRouter');
const userRouter = require('./routes/userRouter');
const messageRouter = require('./routes/messageRouter');
const rssRouter = require('./rssRouter.js'); // Ensure this path is correct

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL_PRODUCTION || 'https://oferti-server.vercel.app/';
const RSS_FEED_URL = process.env.RSS_FEED_URL;

const app = express();

// Middleware setup
app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    process.env.CLIENT_URL_PRODUCTION,
    'http://localhost:3001',
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(helmet());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});

// MongoDB connection
(async () => {
  try {
    await connectDB();
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
})();

// API Routes
app.use('/api/users', userRouter);
app.use('/api/channel', channelRouter);
app.use('/api/message', messageRouter);
app.use('/api/rss', rssRouter); // Only one place to define the /api/rss route

// Handle 404 Not Found
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: `Route ${req.originalUrl} does not exist` });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack || err);
  if (!res.headersSent) {
    res.status(err.status || 500).json({ error: 'Internal Server Error', message: err.message || 'Something went wrong' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Allowed client URL is ${CLIENT_URL}`);
  console.log(`RSS_FEED_URL ${RSS_FEED_URL}`);
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Server is running!');
});
