const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
} = require('../controllers/bookController');
const { protect, authorize } = require('../middleware/auth');
const { isLibrarian } = require('../middleware/role');

// Public routes
router.get('/', getAllBooks);
router.get('/search', searchBooks);
router.get('/:id', getBook);

// Protected routes
router.post('/', protect, isLibrarian, createBook);
router.put('/:id', protect, isLibrarian, updateBook);
router.delete('/:id', protect, isLibrarian, deleteBook);

module.exports = router;
