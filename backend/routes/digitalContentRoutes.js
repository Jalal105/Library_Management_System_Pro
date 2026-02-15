const express = require('express');
const router = express.Router();
const {
  uploadContent,
  getAllContent,
  searchContent,
  getContent,
  downloadContent,
  updateContent,
  deleteContent,
  addReview,
  getStorageInfo,
  browseByCategory,
  getTrending,
  getRecommended,
} = require('../controllers/digitalContentController');
const { protect, authorize } = require('../middleware/auth');
const { upload, validateContentType } = require('../middleware/fileUpload');
const { isLibrarian } = require('../middleware/role');

// Public routes - Browse & Search
router.get('/trending', getTrending);
router.get('/recommended', getRecommended);
router.get('/browse/category/:category', browseByCategory);
router.get('/search', searchContent);
router.get('/', getAllContent);
router.get('/:id', getContent);

// Download route
router.get('/:id/download', protect, downloadContent);

// Protected routes - Upload, Edit, Delete
router.post('/upload', protect, isLibrarian, upload.single('file'), validateContentType, uploadContent);
router.put('/:id', protect, isLibrarian, updateContent);
router.delete('/:id', protect, isLibrarian, deleteContent);

// Review routes
router.post('/:id/review', protect, addReview);

// Storage info route (admin only)
router.get('/storage/info', protect, authorize('admin'), getStorageInfo);

module.exports = router;
