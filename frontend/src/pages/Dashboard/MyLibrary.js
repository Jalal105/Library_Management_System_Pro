import React, { useState, useEffect } from 'react';
import { FiBook, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { authAPI, booksAPI } from '../../services/api';

const MyLibrary = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        setLoading(true);
        const response = await authAPI.getMeBorrowedBooks();
        
        if (response.data.success) {
          // Map the response to the format we need, handling populated bookId
          const books = response.data.data.map(record => ({
            _id: record._id,
            bookId: record.bookId?._id || record.bookId,
            title: record.bookId?.title || 'Unknown',
            author: record.bookId?.author || 'Unknown',
            borrowDate: record.borrowDate,
            dueDate: record.dueDate,
            isReturned: record.isReturned,
          }));
          setBorrowedBooks(books);
        }
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
        toast.error('Failed to load borrowed books');
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowedBooks();
  }, []);

  const handleReturnBook = async (bookId) => {
    try {
      const response = await booksAPI.returnBook(bookId);
      if (response.data.success) {
        toast.success('Book returned successfully!');
        // Refresh the list
        const newResponse = await authAPI.getMeBorrowedBooks();
        if (newResponse.data.success) {
          const books = newResponse.data.data.map(record => ({
            _id: record._id,
            bookId: record.bookId?._id || record.bookId,
            title: record.bookId?.title || 'Unknown',
            author: record.bookId?.author || 'Unknown',
            borrowDate: record.borrowDate,
            dueDate: record.dueDate,
            isReturned: record.isReturned,
          }));
          setBorrowedBooks(books);
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to return book';
      toast.error(message);
    }
  };

  const isOverdue = (dueDate) => new Date() > new Date(dueDate);
  const daysLeft = (dueDate) =>
    Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="heading-2 mb-2">My Library</h1>
        <p className="text-gray-600">Manage your borrowed books and items</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <FiBook className="text-6xl text-gray-300 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : borrowedBooks.length > 0 ? (
        <div className="space-y-4">
          {borrowedBooks.map((book) => (
            <div key={book._id} className="card p-6 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-grow">
                <div className="bg-indigo-100 rounded-lg p-4">
                  <FiBook className="text-2xl text-indigo-600" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-lg">{book.title}</h3>
                  <p className="text-gray-600">{book.author}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-gray-600">
                      Borrowed: {new Date(book.borrowDate).toLocaleDateString()}
                    </span>
                    <span className={isOverdue(book.dueDate) ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                      Due: {new Date(book.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  {isOverdue(book.dueDate) ? (
                    <p className="text-red-600 font-semibold">
                      {Math.abs(daysLeft(book.dueDate))} days overdue
                    </p>
                  ) : (
                    <p className="text-green-600 font-semibold">
                      {daysLeft(book.dueDate)} days left
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => handleReturnBook(book.bookId)}
                  className="btn btn-secondary px-4"
                >
                  Return
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <FiBook className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-4">You haven't borrowed any books yet</p>
          <a href="/books" className="btn btn-primary">
            Browse Books
          </a>
        </div>
      )}
    </div>
  );
};

export default MyLibrary;
