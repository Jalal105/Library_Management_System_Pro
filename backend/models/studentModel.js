const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rollNumber: {
      type: String,
      required: [true, 'Please provide a roll number'],
      unique: true,
    },
    department: {
      type: String,
      required: [true, 'Please provide a department'],
    },
    semester: {
      type: Number,
      required: [true, 'Please provide a semester'],
    },
    borrowedBooks: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book',
        },
        borrowDate: {
          type: Date,
          default: Date.now,
        },
        dueDate: {
          type: Date,
        },
        returnDate: {
          type: Date,
        },
        isReturned: {
          type: Boolean,
          default: false,
        },
      },
    ],
    totalBooksIssued: {
      type: Number,
      default: 0,
    },
    fine: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
