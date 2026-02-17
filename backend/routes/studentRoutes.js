const express = require('express');
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  getStudent,
  issueBook,
  returnBook,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentCotroller');
const { protect } = require('../middleware/auth');
const { isLibrarian, isAdmin } = require('../middleware/role');

// Public: create student profile (could be protected depending on workflow)
router.post('/', protect, createStudent);
router.get('/', protect, getAllStudents);
router.get('/:id', protect, getStudent);

// Issue and return books - only librarians/admins should issue/return on behalf of students
router.post('/:id/issue-book', protect, isLibrarian, issueBook);
router.post('/:id/return-book', protect, isLibrarian, returnBook);

router.put('/:id', protect, updateStudent);
router.delete('/:id', protect, isAdmin, deleteStudent);

module.exports = router;
