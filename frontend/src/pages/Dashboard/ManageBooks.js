import React, { useEffect, useState, useMemo } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { booksAPI } from '../../services/api';
import useAuthStore from '../../stores/authStore';
import AddBookModal from './AddBookModal';
import EditBookModal from './EditBookModal';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const { user } = useAuthStore();

  const categories = [
    'Fiction', 'Non-Fiction', 'Science', 'History', 'Technology',
    'Biography', 'Self-Help', 'Mystery', 'Romance', 'Poetry', 'Drama', 'Educational', 'Reference', 'Other'
  ];

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getAllBooks({ limit: 1000 });
      setBooks(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load books');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    let filtered = books.filter((book) => {
      const matchesSearch =
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !filterCategory || book.category === filterCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort books
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'quantity':
          return b.quantity - a.quantity;
        case 'year':
          return (b.publicationYear || 0) - (a.publicationYear || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [books, searchTerm, filterCategory, sortBy]);

  const handleBookAdded = () => {
    fetchBooks();
  };

  const handleBookUpdated = () => {
    fetchBooks();
    setShowEditModal(false);
    setSelectedBook(null);
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This action cannot be undone.')) {
      try {
        await booksAPI.deleteBook(id);
        setBooks(books.filter(book => book._id !== id));
        toast.success('🗑️ Book deleted successfully');
      } catch (error) {
        toast.error('Failed to delete book');
      }
    }
  };

  if (!user || (user.role !== 'librarian' && user.role !== 'admin')) {
    return (
      <div className="card p-8 text-center bg-red-50 border border-red-200 rounded-xl">
        <div className="text-6xl mb-4">🔒</div>
        <p className="text-gray-600 text-lg font-semibold">Access Denied</p>
        <p className="text-gray-500 mt-2">Only librarians and admins can manage books</p>
      </div>
    );
  }

  const stats = {
    total: books.length,
    filtered: filteredBooks.length,
    totalQuantity: books.reduce((sum, b) => sum + (b.quantity || 0), 0),
    available: books.reduce((sum, b) => sum + (b.availableQuantity || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="heading-2">📚 Manage Library Books</h1>
          <p className="text-gray-600 mt-2">Manage all books in your library inventory</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary inline-flex items-center gap-2 py-2 px-4 rounded-lg font-semibold transition-colors hover:shadow-lg"
        >
          <FiPlus size={20} />
          Add New Book
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Total Books</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">{stats.total}</p>
        </div>
        <div className="card p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <p className="text-sm text-green-600 font-medium">Total Copies</p>
          <p className="text-3xl font-bold text-green-900 mt-2">{stats.totalQuantity}</p>
        </div>
        <div className="card p-4 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <p className="text-sm text-purple-600 font-medium">Available</p>
          <p className="text-3xl font-bold text-purple-900 mt-2">{stats.available}</p>
        </div>
        <div className="card p-4 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
          <p className="text-sm text-amber-600 font-medium">Categories</p>
          <p className="text-3xl font-bold text-amber-900 mt-2">{new Set(books.map(b => b.category)).size}</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="card p-4 border border-gray-200 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
              <FiSearch className="text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by title, author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent flex-1 outline-none text-gray-700"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="title">Sort by Title</option>
            <option value="author">Sort by Author</option>
            <option value="quantity">Sort by Quantity</option>
            <option value="year">Sort by Year</option>
          </select>
        </div>
      </div>

      {/* Results Info */}
      {(searchTerm || filterCategory) && (
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-blue-700 font-medium">
            Found <span className="font-bold text-blue-900">{stats.filtered}</span> books
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterCategory('');
            }}
            className="text-blue-600 hover:text-blue-900 font-semibold text-sm transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Books Table */}
      {loading ? (
        <div className="card p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading books...</p>
        </div>
      ) : filteredBooks.length > 0 ? (
        <div className="overflow-x-auto card border border-gray-200 rounded-xl shadow-sm">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title & Author</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ISBN</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Quantity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredBooks.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900 truncate max-w-xs">{book.title}</p>
                      <p className="text-sm text-gray-600">{book.author}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {book.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-600">{book.isbn}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg text-gray-900">{book.quantity}</span>
                      <span className="text-xs text-gray-500">({book.availableQuantity || 0} avail)</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {(book.availableQuantity || 0) > 0 ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        ✓ In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                        ⚠ Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(book)}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg font-medium transition-colors"
                      title="Edit this book"
                    >
                      <FiEdit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium transition-colors"
                      title="Delete this book"
                    >
                      <FiTrash2 size={16} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card p-12 text-center bg-gray-50 border border-gray-200 rounded-xl">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-600 text-lg font-semibold">No books found</p>
          <p className="text-gray-500 mt-2 mb-4">
            {searchTerm || filterCategory ? 'Try adjusting your search filters' : 'Start by adding a book to your library'}
          </p>
          {!searchTerm && !filterCategory && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary inline-flex items-center gap-2 mt-4"
            >
              <FiPlus size={18} />
              Add Your First Book
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <AddBookModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onBookAdded={handleBookAdded}
      />

      <EditBookModal
        isOpen={showEditModal}
        book={selectedBook}
        onClose={() => {
          setShowEditModal(false);
          setSelectedBook(null);
        }}
        onBookUpdated={handleBookUpdated}
      />
    </div>
  );
};

export default ManageBooks;
