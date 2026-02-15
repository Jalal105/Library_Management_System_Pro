const mongoose = require('mongoose');

const digitalContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      index: true,
    },
    author: {
      type: String,
      required: [true, 'Please provide an author'],
      trim: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['ebook', 'journal', 'paper', 'thesis', 'notes', 'other'],
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject'],
      trim: true,
      index: true,
    },
    keywords: [
      {
        type: String,
        trim: true,
        lowercase: true,
        index: true,
      },
    ],
    description: {
      type: String,
      trim: true,
    },
    publisher: {
      type: String,
      trim: true,
    },
    publicationYear: {
      type: Number,
    },
    isbn: {
      type: String,
      unique: true,
      sparse: true,
    },
    issn: {
      type: String,
      unique: true,
      sparse: true,
    },
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
    thumbnail: {
      filename: String,
      filepath: String,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    tags: [String],
    coverImage: String,
    downloads: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        comment: String,
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    accessLevel: {
      type: String,
      enum: ['public', 'restricted', 'private'],
      default: 'public',
    },
    allowedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    downloadedBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        downloadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    storageSize: Number, // in MB
    pageCount: Number,
    language: {
      type: String,
      default: 'English',
    },
  },
  { timestamps: true }
);

// Text index for advanced search
digitalContentSchema.index({
  title: 'text',
  author: 'text',
  subject: 'text',
  description: 'text',
  keywords: 'text',
  tags: 'text',
});

// Compound index for common searches
digitalContentSchema.index({ type: 1, category: 1, isPublished: 1 });
digitalContentSchema.index({ author: 1, publicationYear: -1 });
digitalContentSchema.index({ keywords: 1, isPublished: 1 });

module.exports = mongoose.model('DigitalContent', digitalContentSchema);
