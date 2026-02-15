import React, { useEffect, useState } from 'react';
import { FiFilter, FiX, FiTrendingUp, FiStar } from 'react-icons/fi';
import { ContentCard, LoadingCard } from '../../components/Cards';
import { digitalContentAPI } from '../../services/api';

const BrowseDigitalContent = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('-views');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const contentTypes = ['ebook', 'journal', 'paper', 'thesis', 'notes'];
  const categories = [
    'Technology',
    'Science',
    'Mathematics',
    'History',
    'Literature',
    'Business',
    'Health',
    'Education',
  ];

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const params = {
          limit: 12,
          page,
          ...(type && { type }),
          ...(category && { category }),
          ...(sortBy && { sortBy }),
        };

        const response = await digitalContentAPI.getAllContent(params);
        setContent(response.data.data);
        setTotal(response.data.total);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [type, category, sortBy, page]);

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    if (filter.trim()) {
      try {
        setLoading(true);
        const response = await digitalContentAPI.searchContent(filter, { type, category });
        setContent(response.data.data);
        setTotal(response.data.count);
        setPage(1);
      } catch (error) {
        console.error('Error searching content:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const clearFilters = () => {
    setFilter('');
    setType('');
    setCategory('');
    setSortBy('-views');
    setPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="heading-2 mb-2">Digital Library</h1>
        <p className="text-gray-600">Explore eBooks, journals, papers, and more</p>
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
                placeholder="Search content..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-field mb-2"
              />
              <button type="submit" className="btn btn-primary w-full">
                Search
              </button>
            </form>

            {/* Content Type */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Content Type</h4>
              <div className="space-y-2">
                {contentTypes.map((t) => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value={t}
                      checked={type === t}
                      onChange={(e) => {
                        setType(e.target.value);
                        setPage(1);
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700 capitalize">{t}</span>
                  </label>
                ))}
                {type && (
                  <button
                    onClick={() => {
                      setType('');
                      setPage(1);
                    }}
                    className="text-indigo-600 text-sm font-semibold mt-2"
                  >
                    Clear Type
                  </button>
                )}
              </div>
            </div>

            {/* Category */}
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
                <option value="-views">Most Viewed</option>
                <option value="-rating.average">Top Rated</option>
                <option value="-downloads">Most Downloaded</option>
                <option value="-createdAt">Newest</option>
              </select>
            </div>

            {/* Clear All */}
            {(filter || type || category || sortBy !== '-views') && (
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
              Showing<span className="font-semibold"> {content.length} </span>
              of<span className="font-semibold"> {total} </span>
              items
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid-responsive">
            {loading ? (
              <>
                {[...Array(12)].map((_, i) => (
                  <LoadingCard key={i} />
                ))}
              </>
            ) : content.length > 0 ? (
              content.map((item) => <ContentCard key={item._id} content={item} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg">No content found</p>
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

export default BrowseDigitalContent;
