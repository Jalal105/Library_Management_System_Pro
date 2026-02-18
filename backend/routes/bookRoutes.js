const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  getBook,
  createBook,
  uploadBook,
  downloadBook,
  updateBook,
  deleteBook,
  searchBooks,
  borrowBook,
  returnBook,
} = require('../controllers/bookController');
const { protect, authorize } = require('../middleware/auth');
const { isLibrarian } = require('../middleware/role');
const { upload } = require('../middleware/fileUpload');

// Public routes
router.get('/', getAllBooks);
router.get('/search', searchBooks);
router.get('/:id', getBook);
router.get('/:id/download', downloadBook);

// Protected routes
router.post('/', protect, isLibrarian, createBook);
router.post('/upload', protect, isLibrarian, upload.single('file'), uploadBook);
router.put('/:id', protect, isLibrarian, updateBook);
router.delete('/:id', protect, isLibrarian, deleteBook);

// Borrow and return routes (student routes)
router.post('/:id/borrow', protect, borrowBook);
router.post('/:id/return', protect, returnBook);

module.exports = router;
