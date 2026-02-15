const Librarian = require('../models/librarianModel');
const User = require('../models/userModel');
const Student = require('../models/studentModel');

// @desc    Create librarian profile
// @route   POST /api/librarians
exports.createLibrarian = async (req, res) => {
  try {
    const { userId, employeeId, department, permissions } = req.body;

    if (!userId || !employeeId) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if librarian already exists
    const librarianExists = await Librarian.findOne({ userId });
    if (librarianExists) {
      return res.status(400).json({ success: false, message: 'Librarian profile already exists' });
    }

    const librarian = await Librarian.create({
      userId,
      employeeId,
      department: department || 'Library',
      permissions: permissions || ['issue_book', 'return_book', 'manage_stock'],
    });

    res.status(201).json({
      success: true,
      data: librarian,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all librarians
// @route   GET /api/librarians
exports.getAllLibrarians = async (req, res) => {
  try {
    const librarians = await Librarian.find().populate('userId', 'name email');

    res.status(200).json({
      success: true,
      count: librarians.length,
      data: librarians,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single librarian
// @route   GET /api/librarians/:id
exports.getLibrarian = async (req, res) => {
  try {
    const librarian = await Librarian.findById(req.params.id).populate('userId', 'name email');

    if (!librarian) {
      return res.status(404).json({ success: false, message: 'Librarian not found' });
    }

    res.status(200).json({
      success: true,
      data: librarian,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update librarian
// @route   PUT /api/librarians/:id
exports.updateLibrarian = async (req, res) => {
  try {
    const { department, permissions } = req.body;

    let librarian = await Librarian.findById(req.params.id);
    if (!librarian) {
      return res.status(404).json({ success: false, message: 'Librarian not found' });
    }

    librarian.department = department || librarian.department;
    librarian.permissions = permissions || librarian.permissions;

    librarian = await librarian.save();

    res.status(200).json({
      success: true,
      data: librarian,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete librarian
// @route   DELETE /api/librarians/:id
exports.deleteLibrarian = async (req, res) => {
  try {
    const librarian = await Librarian.findByIdAndDelete(req.params.id);

    if (!librarian) {
      return res.status(404).json({ success: false, message: 'Librarian not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Librarian deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get librarian statistics
// @route   GET /api/librarians/:id/stats
exports.getLibrarianStats = async (req, res) => {
  try {
    const librarian = await Librarian.findById(req.params.id);

    if (!librarian) {
      return res.status(404).json({ success: false, message: 'Librarian not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        booksIssued: librarian.booksIssued,
        booksReturned: librarian.booksReturned,
        permissions: librarian.permissions,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
