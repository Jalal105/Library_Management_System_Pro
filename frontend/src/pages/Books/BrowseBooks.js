import React, { useEffect, useState } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import { BookCard, LoadingCard } from '../../components/Cards';
import { booksAPI } from '../../services/api';

const BrowseBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const categories = [
    'Fiction',
    'Non-Fiction',
    'Science',
    'Technology',
    'History',
    'Biography',
    'Mystery',
    'Romance',
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const params = {
          limit: 12,
          page,
          ...(category && { category }),
          ...(sortBy && { sortBy }),
        };

        const response = await booksAPI.getAllBooks(params);
        setBooks(response.data.data);
        setTotal(response.data.total);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [category, sortBy, page]);

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    if (filter.trim()) {
      try {
        setLoading(true);
        const response = await booksAPI.searchBooks(filter);
        setBooks(response.data.data);
        setTotal(response.data.count);
        setPage(1);
      } catch (error) {
        console.error('Error searching books:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const clearFilters = () => {
    setFilter('');
    setCategory('');
    setSortBy('-createdAt');
    setPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="heading-2 mb-2">Browse Books</h1>
        <p className="text-gray-600">Explore our collection of books</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden"
              >
                <FiX />
              </button>
            </div>

            {/* Search */}
            <form onSubmit={handleFilterSubmit} className="mb-6">
              <input
                type="text"
                placeholder="Search books..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-field mb-2"
              />
              <button type="submit" className="btn btn-primary w-full">
                Search
              </button>
            </form>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Category</h4>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={category === cat}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setPage(1);
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700">{cat}</span>
                  </label>
                ))}
                {category && (
                  <button
                    onClick={() => {
                      setCategory('');
                      setPage(1);
                    }}
                    className="text-indigo-600 text-sm font-semibold mt-2"
                  >
                    Clear Category
                  </button>
                )}
              </div>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Sort By</h4>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="input-field"
              >
                <option value="-createdAt">Newest</option>
                <option value="title">Title (A-Z)</option>
                <option value="author">Author</option>
              </select>
            </div>

            {/* Clear All */}
            {(filter || category || sortBy !== '-createdAt') && (
              <button
                onClick={clearFilters}
                className="btn btn-secondary w-full"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(true)}
              className="btn btn-secondary w-full flex items-center justify-center gap-2"
            >
              <FiFilter />
              Show Filters
            </button>
          </div>

          {/* Results Info */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing<span className="font-semibold"> {books.length} </span>
              of<span className="font-semibold"> {total} </span>
              books
            </p>
          </div>

          {/* Books Grid */}
          <div className="grid-responsive">
            {loading ? (
              <>
                {[...Array(12)].map((_, i) => (
                  <LoadingCard key={i} />
                ))}
              </>
            ) : books.length > 0 ? (
              books.map((book) => <BookCard key={book._id} book={book} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg">No books found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && total > 12 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {page} of {Math.ceil(total / 12)}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(total / 12)}
                className="btn btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseBooks;
