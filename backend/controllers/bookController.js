const Book = require('../models/bookModel');

// @desc    Get all books
// @route   GET /api/books
exports.getAllBooks = async (req, res) => {
  try {
    const { category, author, isAvailable, search } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (author) filter.author = new RegExp(author, 'i');
    if (isAvailable === 'true') filter.isAvailable = true;
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { author: new RegExp(search, 'i') },
        { isbn: new RegExp(search, 'i') },
      ];
    }

    const books = await Book.find(filter);

    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create book
// @route   POST /api/books
exports.createBook = async (req, res) => {
  try {
    const { title, author, isbn, description, category, quantity, publicationYear, publisher } = req.body;

    // Validation
    if (!title || !author || !isbn || !category || !quantity) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check if ISBN exists
    const bookExists = await Book.findOne({ isbn });
    if (bookExists) {
      return res.status(400).json({ success: false, message: 'Book with this ISBN already exists' });
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      description,
      category,
      quantity,
      availableQuantity: quantity,
      publicationYear,
      publisher,
    });

    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
exports.updateBook = async (req, res) => {
  try {
    const { title, author, description, category, quantity, publicationYear, publisher, isAvailable } = req.body;

    let book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.category = category || book.category;
    book.quantity = quantity || book.quantity;
    book.publicationYear = publicationYear || book.publicationYear;
    book.publisher = publisher || book.publisher;
    book.isAvailable = isAvailable !== undefined ? isAvailable : book.isAvailable;

    book = await book.save();

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Search books
// @route   GET /api/books/search
exports.searchBooks = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Please provide a search query' });
    }

    const books = await Book.find({
      $or: [
        { title: new RegExp(query, 'i') },
        { author: new RegExp(query, 'i') },
        { isbn: query },
        { category: new RegExp(query, 'i') },
      ],
    });

    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
