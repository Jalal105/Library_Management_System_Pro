const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a book title'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Please provide an author'],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, 'Please provide an ISBN'],
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide quantity'],
      default: 1,
    },
    availableQuantity: {
      type: Number,
      default: function () {
        return this.quantity;
      },
    },
    publicationYear: {
      type: Number,
    },
    publisher: {
      type: String,
    },
    image: {
      type: String,
    },
    // File upload support
    file: {
      originalName: String,
      filename: String,
      filepath: String,
      mimeType: String,
      size: Number, // in bytes
      uploadDate: {
        type: Date,
        default: Date.now,
      },
    },
    fileSize: {
      type: String, // in MB
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    downloads: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
