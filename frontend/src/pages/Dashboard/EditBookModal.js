import React, { useState, useEffect } from 'react';
import { FiX, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { booksAPI } from '../../services/api';

const EditBookModal = ({ isOpen, book, onClose, onBookUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    category: '',
    quantity: '',
    publicationYear: '',
    publisher: '',
  });

  const categories = [
    'Fiction',
    'Non-Fiction',
    'Science',
    'History',
    'Technology',
    'Biography',
    'Self-Help',
    'Mystery',
    'Romance',
    'Poetry',
    'Drama',
    'Educational',
    'Reference',
    'Other',
  ];

  // Initialize form when book is provided
  useEffect(() => {
    if (book && isOpen) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        description: book.description || '',
        category: book.category || '',
        quantity: book.quantity?.toString() || '',
        publicationYear: book.publicationYear?.toString() || '',
        publisher: book.publisher || '',
      });
      setErrors({});
    }
  }, [book, isOpen]);

  const validateISBN = (isbn) => {
    const cleanISBN = isbn.replace(/-/g, '');
    return cleanISBN.length === 10 || cleanISBN.length === 13;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.isbn.trim()) {
      newErrors.isbn = 'ISBN is required';
    } else if (!validateISBN(formData.isbn)) {
      newErrors.isbn = 'Invalid ISBN format (10 or 13 digits)';
    }
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.quantity || parseInt(formData.quantity) < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }
    if (formData.publicationYear && (parseInt(formData.publicationYear) < 1000 || parseInt(formData.publicationYear) > new Date().getFullYear())) {
      newErrors.publicationYear = 'Invalid publication year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);
      const submitData = {
        ...formData,
        quantity: parseInt(formData.quantity),
        publicationYear: formData.publicationYear ? parseInt(formData.publicationYear) : null,
      };
      await booksAPI.updateBook(book._id, submitData);
      toast.success('✏️ Book updated successfully!');
      onBookUpdated();
      onClose();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update book';
      toast.error(errorMsg);
      if (error.response?.data?.details) {
        setErrors(error.response.data.details);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-amber-50 to-orange-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">✏️ Edit Book</h2>
            <p className="text-sm text-gray-600 mt-1">Update the book details below</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            disabled={loading}
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book title"
                className={`w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <FiAlertCircle size={14} />
                  {errors.title}
                </div>
              )}
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Author <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                className={`w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.author ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.author && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <FiAlertCircle size={14} />
                  {errors.author}
                </div>
              )}
            </div>

            {/* ISBN */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ISBN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="10 or 13 digits"
                className={`w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.isbn ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.isbn ? (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <FiAlertCircle size={14} />
                  {errors.isbn}
                </div>
              ) : (
                <p className="text-xs text-gray-500 mt-1">Format: 10 or 13 digits, hyphens optional</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <FiAlertCircle size={14} />
                  {errors.category}
                </div>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                max="9999"
                className={`w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.quantity ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.quantity && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <FiAlertCircle size={14} />
                  {errors.quantity}
                </div>
              )}
            </div>

            {/* Publication Year */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Publication Year
              </label>
              <input
                type="number"
                name="publicationYear"
                value={formData.publicationYear}
                onChange={handleChange}
                min="1000"
                max={new Date().getFullYear()}
                className={`w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.publicationYear ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.publicationYear && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <FiAlertCircle size={14} />
                  {errors.publicationYear}
                </div>
              )}
            </div>

            {/* Publisher */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Publisher
              </label>
              <input
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a brief description of the book"
              rows="3"
              maxLength="500"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 characters</p>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              <>
                <FiCheckCircle size={18} />
                Update Book
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookModal;
