const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/db');

// Initialize app
const app = express();

// Trust proxy for production environments like Heroku/Vercel
app.set('trust proxy', 1);

// Connect to database
connectDB();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow images to be loaded across origins
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || '*',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/userRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/digital-content', require('./routes/digitalContentRoutes'));

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
  // Set build folder as static
  const frontendBuildPath = path.join(__dirname, '../frontend/build');
  app.use(express.static(frontendBuildPath));

  // Any other route should serve the index.html from frontend/build
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
} else {
  // Basic route for development
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Library Management System API',
      version: '1.0.0',
      status: 'Running (Development)',
    });
  });
}



// Error handling middleware
app.use((error, req, res, next) => {
  // Multer errors
  if (error.message && error.message.includes('File')) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  // Log error for debugging but don't expose stack trace in production
  console.error('Error:', error);

  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: error.message || 'An internal server error occurred',
    // stack: process.env.NODE_ENV === 'production' ? null : error.stack,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

