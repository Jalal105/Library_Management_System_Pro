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
// @desc    Upload book with file
// @route   POST /api/books/upload
exports.uploadBook = async (req, res) => {
  try {
    const { title, author, isbn, description, category, quantity, publicationYear, publisher } = req.body;

    // Validation
    if (!title || !author || !isbn || !category || !quantity) {
      if (req.file) {
        const fs = require('fs');
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check if ISBN exists
    const bookExists = await Book.findOne({ isbn });
    if (bookExists) {
      if (req.file) {
        const fs = require('fs');
        fs.unlinkSync(req.file.path);
      }
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
      file: req.file ? {
        originalName: req.file.originalname,
        filename: req.file.filename,
        filepath: req.file.path,
        mimeType: req.file.mimetype,
        size: req.file.size,
      } : undefined,
    });

    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (error) {
    if (req.file) {
      const fs = require('fs');
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Download book
// @route   GET /api/books/:id/download
exports.downloadBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book || !book.file) {
      return res.status(404).json({ success: false, message: 'Book file not found' });
    }

    const filePath = book.file.filepath;
    res.download(filePath, book.file.originalName, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Borrow book
// @route   POST /api/books/:id/borrow
// @desc    Borrow a book (available for all authenticated users: admin, librarian, student)
// @route   POST /api/books/:id/borrow
exports.borrowBook = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    // Validate user authentication
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    // Find the book
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Check availability
    if (book.availableQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Book is not available for borrowing',
        available: 0,
      });
    }

    // Get student or user profile (use findOneAndUpdate with upsert to avoid duplicate key error)
    const Student = require('../models/studentModel');
    let student = await Student.findOneAndUpdate(
      { userId: userId },
      {
        $setOnInsert: {
          userId: userId,
          borrowedBooks: [],
        }
      },
      { upsert: true, new: true }
    );

    // Ensure borrowedBooks array exists
    if (!student.borrowedBooks) {
      student.borrowedBooks = [];
    }

    // Check if user has already borrowed this book
    const alreadyBorrowed = student.borrowedBooks.some(
      (b) => b.bookId && b.bookId.toString() === id && !b.isReturned
    );

    if (alreadyBorrowed) {
      return res.status(400).json({
        success: false,
        message: 'You have already borrowed this book. Please return it first.',
      });
    }

    // Add to borrowed books
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days borrow period

    const borrowRecord = {
      bookId: id,
      borrowDate: new Date(),
      dueDate: dueDate,
      isReturned: false,
    };

    student.borrowedBooks.push(borrowRecord);
    student.totalBooksIssued = (student.totalBooksIssued || 0) + 1;

    // Decrease available quantity
    book.availableQuantity -= 1;
    if (book.availableQuantity === 0) {
      book.isAvailable = false;
    }

    await student.save();
    await book.save();

    res.status(200).json({
      success: true,
      message: 'Book borrowed successfully',
      data: {
        book: {
          id: book._id,
          title: book.title,
          author: book.author,
        },
        borrowDate: borrowRecord.borrowDate,
        dueDate: borrowRecord.dueDate,
        availableQuantity: book.availableQuantity,
      },
    });
  } catch (error) {
    console.error('Borrow book error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Return a borrowed book (available for all authenticated users: admin, librarian, student)
// @route   POST /api/books/:id/return
exports.returnBook = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    // Validate user authentication
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const Student = require('../models/studentModel');
    const student = await Student.findOne({ userId });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    // Find the borrowed book
    const borrowedBook = student.borrowedBooks.find(
      (b) => b.bookId && b.bookId.toString() === id && !b.isReturned
    );

    if (!borrowedBook) {
      return res.status(404).json({ success: false, message: 'Borrowed book not found in your records' });
    }

    // Mark as returned
    borrowedBook.isReturned = true;
    borrowedBook.returnDate = new Date();

    // Check for fine (if returned after due date)
    let fine = 0;
    if (borrowedBook.returnDate > borrowedBook.dueDate) {
      const daysLate = Math.ceil(
        (borrowedBook.returnDate - borrowedBook.dueDate) / (1000 * 60 * 60 * 24)
      );
      fine = daysLate * 10; // 10 per day late fee
      student.fine = (student.fine || 0) + fine;
    }

    // Increase available quantity
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    book.availableQuantity += 1;
    if (book.isAvailable === false) {
      book.isAvailable = true;
    }

    await student.save();
    await book.save();

    res.status(200).json({
      success: true,
      message: 'Book returned successfully',
      data: {
        returnDate: borrowedBook.returnDate,
        fine: fine,
        totalFine: student.fine,
      },
    });
  } catch (error) {
    console.error('Return book error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};