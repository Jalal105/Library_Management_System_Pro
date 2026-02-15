const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  getAllUsers,
  updateUser,
  deleteUser,
} = require('../controllers/userControllers');
const { protect, authorize } = require('../middleware/auth');

// Auth routes
router.post('/register', register);
router.post('/login', login);

// User routes
router.get('/me', protect, getMe);
router.get('/', protect, authorize('admin'), getAllUsers);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
