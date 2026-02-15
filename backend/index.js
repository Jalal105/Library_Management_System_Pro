const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Initialize app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/userRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/digital-content', require('./routes/digitalContentRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Library Management System API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        getProfile: 'GET /api/auth/me',
      },
      users: {
        getAll: 'GET /api/users',
        getById: 'GET /api/users/:id',
        update: 'PUT /api/users/:id',
        delete: 'DELETE /api/users/:id',
      },
      books: {
        getAll: 'GET /api/books',
        getById: 'GET /api/books/:id',
        search: 'GET /api/books/search?query=keyword',
        create: 'POST /api/books',
        update: 'PUT /api/books/:id',
        delete: 'DELETE /api/books/:id',
      },
      digitalContent: {
        browse: 'GET /api/digital-content',
        search: 'GET /api/digital-content/search?query=keyword',
        getById: 'GET /api/digital-content/:id',
        trending: 'GET /api/digital-content/trending',
        recommended: 'GET /api/digital-content/recommended',
        browseCategory: 'GET /api/digital-content/browse/category/:category',
        download: 'GET /api/digital-content/:id/download',
        upload: 'POST /api/digital-content/upload',
        update: 'PUT /api/digital-content/:id',
        delete: 'DELETE /api/digital-content/:id',
        addReview: 'POST /api/digital-content/:id/review',
        storageInfo: 'GET /api/digital-content/storage/info',
      },
    },
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  // Multer errors
  if (error.message && error.message.includes('File')) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'An error occurred',
    error: error.message,
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
