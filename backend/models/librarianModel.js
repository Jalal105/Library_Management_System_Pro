const mongoose = require('mongoose');

const librarianSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    employeeId: {
      type: String,
      required: [true, 'Please provide an employee ID'],
      unique: true,
    },
    department: {
      type: String,
      default: 'Library',
    },
    booksIssued: {
      type: Number,
      default: 0,
    },
    booksReturned: {
      type: Number,
      default: 0,
    },
    permissions: {
      type: [String],
      default: ['issue_book', 'return_book', 'manage_stock'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Librarian', librarianSchema);
