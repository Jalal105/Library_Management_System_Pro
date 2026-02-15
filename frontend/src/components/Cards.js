import React from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiDownload, FiEye, FiStar } from 'react-icons/fi';

export const BookCard = ({ book }) => {
  return (
    <Link to={`/books/${book._id}`}>
      <div className="card h-full flex flex-col">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 h-40 flex items-center justify-center">
          <FiBook className="text-6xl text-white opacity-30" />
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-1">{book.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{book.author}</p>
            <p className="text-xs text-gray-500 mb-3">{book.category}</p>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-600">
            <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded">
              {book.availableQuantity > 0 ? 'Available' : 'Unavailable'}
            </span>
            <span>Qty: {book.quantity}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const ContentCard = ({ content }) => {
  return (
    <Link to={`/digital-content/${content._id}`}>
      <div className="card h-full flex flex-col">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 h-40 flex items-center justify-center">
          <FiBook className="text-6xl text-white opacity-30" />
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-1">{content.title}</h3>
            <p className="text-sm text-gray-600 mb-1">{content.author}</p>
            <p className="text-xs text-gray-500 mb-3">
              <span className="inline-block bg-pink-100 text-pink-800 px-2 py-1 rounded">
                {content.type}
              </span>
            </p>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-600 border-t pt-2">
            <div className="flex items-center gap-1">
              <FiEye size={16} />
              {content.views}
            </div>
            <div className="flex items-center gap-1">
              <FiDownload size={16} />
              {content.downloads}
            </div>
            <div className="flex items-center gap-1">
              <FiStar size={16} className="text-yellow-500" />
              {content.rating.average.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const LoadingCard = () => (
  <div className="card h-60 animate-pulse">
    <div className="bg-gray-300 h-40" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-3 bg-gray-300 rounded w-1/2" />
      <div className="h-3 bg-gray-300 rounded w-2/3" />
    </div>
  </div>
);
