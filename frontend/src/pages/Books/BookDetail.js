import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiBook, FiArrowLeft, FiDownload, FiBarChart2, FiUser, FiCalendar } from 'react-icons/fi';
import { booksAPI } from '../../services/api';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await booksAPI.getBookById(id);
        setBook(response.data.data);
      } catch (error) {
        toast.error('Failed to load book details');
        navigate('/books');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin">
            <FiBook className="text-6xl text-indigo-600 mx-auto" />
          </div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Book not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/books')}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
      >
        <FiArrowLeft />
        Back to Books
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Book Cover */}
        <div className="md:col-span-1">
          <div className="card aspect-[3/4] flex items-center justify-center bg-gradient-to-br from-indigo-500 to-indigo-700 sticky top-24">
            <FiBook className="text-9xl text-white opacity-30" />
          </div>
        </div>

        {/* Book Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Title & Author */}
          <div>
            <h1 className="heading-1 mb-2">{book.title}</h1>
            <p className="flex items-center gap-2 text-gray-600 text-lg">
              <FiUser />
              {book.author}
            </p>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-4 text-center">
              <p className="text-gray-600 text-sm mb-1">Category</p>
              <p className="font-bold">{book.category}</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-gray-600 text-sm mb-1">ISBN</p>
              <p className="font-bold text-sm">{book.isbn}</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-gray-600 text-sm mb-1">Quantity</p>
              <p className="font-bold text-lg">{book.quantity}</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-gray-600 text-sm mb-1">Available</p>
              <p className={`font-bold text-lg ${book.availableQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {book.availableQuantity}
              </p>
            </div>
          </div>

          {/* Description */}
          {book.description && (
            <div>
              <h3 className="heading-3 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </div>
          )}

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {book.publisher && (
              <div className="card p-4">
                <p className="text-gray-600 text-sm">Publisher</p>
                <p className="font-semibold">{book.publisher}</p>
              </div>
            )}
            {book.publicationYear && (
              <div className="card p-4">
                <p className="text-gray-600 text-sm flex items-center gap-2">
                  <FiCalendar />
                  Publication Year
                </p>
                <p className="font-semibold">{book.publicationYear}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <button
              disabled={book.availableQuantity === 0}
              className="btn btn-primary flex-1 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiDownload />
              {book.availableQuantity > 0 ? 'Borrow Book' : 'Not Available'}
            </button>
            <button className="btn btn-secondary flex-1 py-3 font-semibold">
              <FiBarChart2 />
              View Statistics
            </button>
          </div>

          {/* Availability Status */}
          <div className={`p-4 rounded-lg ${book.isAvailable ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className={book.isAvailable ? 'text-green-800' : 'text-red-800'}>
              {book.isAvailable
                ? `✓ This book is available. ${book.availableQuantity} copy/copies in stock.`
                : '✗ This book is currently not available.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
