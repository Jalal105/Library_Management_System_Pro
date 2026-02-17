import React, { useState, useEffect } from 'react';
import { FiBook } from 'react-icons/fi';
import useAuthStore from '../../stores/authStore';

const MyLibrary = () => {
  useAuthStore();
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data - in real app, fetch from API
    setBorrowedBooks([
      {
        _id: '1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        borrowDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
        isReturned: false,
      },
      {
        _id: '2',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        borrowDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        returnDate: null,
        isReturned: false,
      },
    ]);
    setLoading(false);
  }, []);

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
                <button className="btn btn-secondary px-4">Return</button>
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
