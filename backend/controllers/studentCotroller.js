const Student = require('../models/studentModel');
const User = require('../models/userModel');
const Book = require('../models/bookModel');

// @desc    Create student profile
// @route   POST /api/students
exports.createStudent = async (req, res) => {
  try {
    const { userId, rollNumber, department, semester } = req.body;

    if (!userId || !rollNumber || !department || !semester) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if student already exists
    const studentExists = await Student.findOne({ userId });
    if (studentExists) {
      return res.status(400).json({ success: false, message: 'Student profile already exists' });
    }

    const student = await Student.create({
      userId,
      rollNumber,
      department,
      semester,
    });

    res.status(201).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all students
// @route   GET /api/students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('userId', 'name email')
      .populate('borrowedBooks.bookId', 'title author');

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('borrowedBooks.bookId', 'title author');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Issue book to student
// @route   POST /api/students/:id/issue-book
exports.issueBook = async (req, res) => {
  try {
    const { bookId, dueDate } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.availableQuantity <= 0) {
      return res.status(400).json({ success: false, message: 'Book is not available' });
    }

    // Add book to borrowed books
    student.borrowedBooks.push({
      bookId,
      dueDate: dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
    });

    // Update book quantity
    book.availableQuantity -= 1;
    if (book.availableQuantity === 0) {
      book.isAvailable = false;
    }

    student.totalBooksIssued += 1;

    await student.save();
    await book.save();

    res.status(200).json({
      success: true,
      message: 'Book issued successfully',
      data: student,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Return book from student
// @route   POST /api/students/:id/return-book
exports.returnBook = async (req, res) => {
  try {
    const { bookId } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Find the borrowed book
    const borrowedBook = student.borrowedBooks.find(
      (b) => b.bookId.toString() === bookId && !b.isReturned
    );

    if (!borrowedBook) {
      return res.status(400).json({ success: false, message: 'Book not found in borrowed list' });
    }

    // Mark as returned
    borrowedBook.returnDate = new Date();
    borrowedBook.isReturned = true;

    // Check for fine (overdue)
    if (new Date() > borrowedBook.dueDate) {
      const days = Math.ceil((new Date() - borrowedBook.dueDate) / (1000 * 60 * 60 * 24));
      const fine = days * 10; // 10 per day
      student.fine += fine;
    }

    // Update book quantity
    book.availableQuantity += 1;
    if (book.availableQuantity > 0) {
      book.isAvailable = true;
    }

    await student.save();
    await book.save();

    res.status(200).json({
      success: true,
      message: 'Book returned successfully',
      data: student,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
exports.updateStudent = async (req, res) => {
  try {
    const { department, semester } = req.body;

    let student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    student.department = department || student.department;
    student.semester = semester || student.semester;

    student = await student.save();

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
