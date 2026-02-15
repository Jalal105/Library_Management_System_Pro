const mongoose = require('mongoose');

const bookFilterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    filterName: {
      type: String,
      required: [true, 'Please provide a filter name'],
    },
    filters: {
      category: String,
      author: String,
      publicationYear: Number,
      isAvailable: Boolean,
    },
    sortBy: {
      type: String,
      enum: ['title', 'author', 'date', 'relevance'],
      default: 'title',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BookFilter', bookFilterSchema);
