import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { BookCard, ContentCard, LoadingCard } from '../components/Cards';
import { booksAPI, digitalContentAPI } from '../services/api';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [books, setBooks] = useState([]);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const [booksRes, contentRes] = await Promise.all([
        booksAPI.searchBooks(searchQuery),
        digitalContentAPI.searchContent(searchQuery),
      ]);

      setBooks(booksRes.data.data);
      setContent(contentRes.data.data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalResults = books.length + content.length;

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div>
        <h1 className="heading-2 mb-4">Search Library</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search books, content, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 py-3"
            />
          </div>
          <button type="submit" className="btn btn-primary px-8 py-3">
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      {searchQuery && (
        <>
          <div className="text-gray-600">
            Found <span className="font-bold">{totalResults}</span> results for "<span className="font-bold">{searchQuery}</span>"
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 font-semibold border-b-2 transition ${
                activeTab === 'all'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-indigo-600'
              }`}
            >
              All Results ({totalResults})
            </button>
            <button
              onClick={() => setActiveTab('books')}
              className={`px-4 py-2 font-semibold border-b-2 transition ${
                activeTab === 'books'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-indigo-600'
              }`}
            >
              Books ({books.length})
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 font-semibold border-b-2 transition ${
                activeTab === 'content'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-indigo-600'
              }`}
            >
              Digital Content ({content.length})
            </button>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="grid-responsive">
              {[...Array(6)].map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-12">
              {(activeTab === 'all' || activeTab === 'books') && books.length > 0 && (
                <div>
                  <h2 className="heading-3 mb-6">Books ({books.length})</h2>
                  <div className="grid-responsive">
                    {books.map((book) => (
                      <BookCard key={book._id} book={book} />
                    ))}
                  </div>
                </div>
              )}

              {(activeTab === 'all' || activeTab === 'content') && content.length > 0 && (
                <div>
                  <h2 className="heading-3 mb-6">Digital Content ({content.length})</h2>
                  <div className="grid-responsive">
                    {content.map((item) => (
                      <ContentCard key={item._id} content={item} />
                    ))}
                  </div>
                </div>
              )}

              {totalResults === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No results found for your search</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {!searchQuery && (
        <div className="text-center py-12">
          <FiSearch className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Enter a search query to get started</p>
        </div>
      )}
    </div>
  );
};

export default Search;
