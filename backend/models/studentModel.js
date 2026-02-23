const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    rollNumber: {
      type: String,
    },
    department: {
      type: String,
    },
    semester: {
      type: Number,
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
