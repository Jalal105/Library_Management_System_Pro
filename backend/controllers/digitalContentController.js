const DigitalContent = require('../models/digitalContentModel');
const path = require('path');
const fs = require('fs');
const { getStorageInfo } = require('../middleware/fileUpload');

// @desc    Upload digital content
// @route   POST /api/digital-content/upload
exports.uploadContent = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const {
      title,
      author,
      type,
      subject,
      keywords,
      description,
      publisher,
      publicationYear,
      isbn,
      issn,
      category,
      tags,
      accessLevel,
    } = req.body;

    // Validation
    if (!title || !author || !type || !subject || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, author, type, subject, and category',
      });
    }

    // Check if content already exists
    const existingContent = await DigitalContent.findOne({ isbn: isbn || null, issn: issn || null });
    if (isbn && existingContent) {
      return res.status(400).json({
        success: false,
        message: 'Content with this ISBN already exists',
      });
    }

    // Process keywords
    const keywordArray = keywords
      ? typeof keywords === 'string'
        ? keywords.split(',').map((k) => k.trim().toLowerCase())
        : keywords.map((k) => k.toLowerCase())
      : [];

    // Create content document
    const content = await DigitalContent.create({
      title,
      author,
      type,
      subject,
      keywords: keywordArray,
      description,
      publisher,
      publicationYear,
      isbn,
      issn,
      category,
      tags: tags ? (typeof tags === 'string' ? tags.split(',') : tags) : [],
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        filepath: req.file.path,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
      storageSize: (req.file.size / (1024 * 1024)).toFixed(2),
      accessLevel: accessLevel || 'public',
    });

    res.status(201).json({
      success: true,
      message: 'Content uploaded successfully',
      data: content,
    });
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all digital content with advanced filters
// @route   GET /api/digital-content
exports.getAllContent = async (req, res) => {
  try {
    const {
      type,
      category,
      author,
      subject,
      keyword,
      sortBy = '-createdAt',
      page = 1,
      limit = 10,
    } = req.query;

    let filter = { isPublished: true };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (author) filter.author = new RegExp(author, 'i');
    if (subject) filter.subject = new RegExp(subject, 'i');
    if (keyword) {
      filter.keywords = new RegExp(keyword, 'i');
    }

    const skip = (page - 1) * limit;
    const content = await DigitalContent.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('bookId', 'title isbn');

    const total = await DigitalContent.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: content.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: content,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Advanced search with keyword matching
// @route   GET /api/digital-content/search
exports.searchContent = async (req, res) => {
  try {
    const { query, filters, sortBy = '-rating.average' } = req.query;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Please provide a search query' });
    }

    let searchFilter = {
      isPublished: true,
      $text: { $search: query },
    };

    // Apply additional filters
    if (filters) {
      const parsedFilters = typeof filters === 'string' ? JSON.parse(filters) : filters;

      if (parsedFilters.type) searchFilter.type = parsedFilters.type;
      if (parsedFilters.category) searchFilter.category = parsedFilters.category;
      if (parsedFilters.author) searchFilter.author = new RegExp(parsedFilters.author, 'i');
      if (parsedFilters.subject) searchFilter.subject = new RegExp(parsedFilters.subject, 'i');
      if (parsedFilters.year) searchFilter.publicationYear = parsedFilters.year;
    }

    const content = await DigitalContent.find(searchFilter)
      .sort(sortBy)
      .limit(50)
      .populate('bookId', 'title isbn');

    res.status(200).json({
      success: true,
      count: content.length,
      data: content,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get content by ID
// @route   GET /api/digital-content/:id
exports.getContent = async (req, res) => {
  try {
    const content = await DigitalContent.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('bookId', 'title isbn author');

    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Download digital content
// @route   GET /api/digital-content/:id/download
exports.downloadContent = async (req, res) => {
  try {
    const content = await DigitalContent.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    // Add user to downloaded list if authenticated
    if (req.user) {
      await DigitalContent.updateOne(
        { _id: req.params.id },
        {
          $push: {
            downloadedBy: {
              userId: req.user._id,
              downloadDate: new Date(),
            },
          },
        }
      );
    }

    const filePath = content.file.filepath;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found on server' });
    }

    res.download(filePath, content.file.originalName);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update digital content
// @route   PUT /api/digital-content/:id
exports.updateContent = async (req, res) => {
  try {
    const { title, author, subject, keywords, description, category, tags, accessLevel, isPublished } =
      req.body;

    let content = await DigitalContent.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    if (title) content.title = title;
    if (author) content.author = author;
    if (subject) content.subject = subject;
    if (keywords) {
      content.keywords = typeof keywords === 'string' ? keywords.split(',').map((k) => k.trim()) : keywords;
    }
    if (description) content.description = description;
    if (category) content.category = category;
    if (tags) content.tags = typeof tags === 'string' ? tags.split(',') : tags;
    if (accessLevel) content.accessLevel = accessLevel;
    if (isPublished !== undefined) content.isPublished = isPublished;

    content = await content.save();

    res.status(200).json({
      success: true,
      message: 'Content updated successfully',
      data: content,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete digital content
// @route   DELETE /api/digital-content/:id
exports.deleteContent = async (req, res) => {
  try {
    const content = await DigitalContent.findByIdAndDelete(req.params.id);

    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    // Delete file from server
    if (content.file && content.file.filepath && fs.existsSync(content.file.filepath)) {
      fs.unlinkSync(content.file.filepath);
    }

    res.status(200).json({
      success: true,
      message: 'Content deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add review to content
// @route   POST /api/digital-content/:id/review
exports.addReview = async (req, res) => {
  try {
    const { comment, rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Please provide a rating between 1 and 5' });
    }

    const content = await DigitalContent.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    // Add review
    content.reviews.push({
      userId: req.user._id,
      comment,
      rating,
    });

    // Update average rating
    const totalRating = content.reviews.reduce((sum, review) => sum + review.rating, 0);
    content.rating.average = (totalRating / content.reviews.length).toFixed(1);
    content.rating.count = content.reviews.length;

    await content.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: content,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get storage information
// @route   GET /api/digital-content/storage/info
exports.getStorageInfo = async (req, res) => {
  try {
    const storageInfo = getStorageInfo();

    const totalFiles = await DigitalContent.countDocuments();
    const totalSize = await DigitalContent.aggregate([
      {
        $group: {
          _id: null,
          totalSize: { $sum: '$storageSize' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...storageInfo,
        totalFiles,
        dbTotalSize: totalSize[0]?.totalSize || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Browse content by category
// @route   GET /api/digital-content/browse/category/:category
exports.browseByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { sortBy = '-views', limit = 20 } = req.query;

    const content = await DigitalContent.find({
      category,
      isPublished: true,
    })
      .sort(sortBy)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: content.length,
      data: content,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get trending content
// @route   GET /api/digital-content/trending
exports.getTrending = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const trending = await DigitalContent.find({ isPublished: true })
      .sort('-views')
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: trending.length,
      data: trending,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recommended content
// @route   GET /api/digital-content/recommended
exports.getRecommended = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const recommended = await DigitalContent.find({ isPublished: true })
      .sort('-rating.average')
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: recommended.length,
      data: recommended,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
