import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBook, FiSearch, FiArrowRight, FiTrendingUp, FiStar } from 'react-icons/fi';
import { ContentCard, BookCard, LoadingCard } from '../components/Cards';
import { digitalContentAPI, booksAPI } from '../services/api';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [booksRes, , trendingRes, recommendedRes] = await Promise.all([
          booksAPI.getAllBooks({ limit: 6 }),
          digitalContentAPI.getAllContent({ limit: 6 }),
          digitalContentAPI.getTrending({ limit: 6 }),
          digitalContentAPI.getRecommended({ limit: 6 }),
        ]);

        setBooks(booksRes.data.data);
        setTrending(trendingRes.data.data);
        setRecommended(recommendedRes.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 md:p-16 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <h1 className="heading-1 mb-4 text-white">
            Welcome to Your Digital Library
          </h1>
          <p className="text-lg mb-8 text-indigo-100 max-w-2xl">
            Discover thousands of books and digital content. Search, browse, and download your favorite materials instantly.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={() => navigate('/search')}
              className="btn btn-primary bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-3"
            >
              <FiSearch /> Start Searching
            </button>
            <Link to="/books" className="btn btn-secondary bg-indigo-500 text-white hover:bg-indigo-400 text-lg px-8 py-3">
              Browse Books
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="heading-2">Featured Books</h2>
            <p className="text-gray-600">Our latest additions to the library</p>
          </div>
          <Link to="/books" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold">
            View All <FiArrowRight />
          </Link>
        </div>
        <div className="grid-responsive">
          {loading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </>
          ) : (
            books.map((book) => <BookCard key={book._id} book={book} />)
          )}
        </div>
      </section>

      {/* Trending Content */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="heading-2 flex items-center gap-2">
              <FiTrendingUp className="text-pink-600" />
              Trending Now
            </h2>
            <p className="text-gray-600">Most viewed digital content</p>
          </div>
          <Link to="/digital-content" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold">
            View All <FiArrowRight />
          </Link>
        </div>
        <div className="grid-responsive">
          {loading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </>
          ) : (
            trending.map((item) => <ContentCard key={item._id} content={item} />)
          )}
        </div>
      </section>

      {/* Recommended Content */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="heading-2 flex items-center gap-2">
              <FiStar className="text-yellow-500" />
              Recommended for You
            </h2>
            <p className="text-gray-600">Highly rated content from our community</p>
          </div>
          <Link to="/digital-content" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold">
            View All <FiArrowRight />
          </Link>
        </div>
        <div className="grid-responsive">
          {loading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </>
          ) : (
            recommended.map((item) => <ContentCard key={item._id} content={item} />)
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-light rounded-2xl p-8 md:p-12">
        <h2 className="heading-2 text-center mb-12">Why Choose Our Library?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FiBook className="text-4xl text-indigo-600" />,
              title: 'Vast Collection',
              desc: 'Access thousands of books and digital content in one place',
            },
            {
              icon: <FiSearch className="text-4xl text-purple-600" />,
              title: 'Advanced Search',
              desc: 'Find exactly what you need with our powerful search tools',
            },
            {
              icon: <FiArrowRight className="text-4xl text-pink-600" />,
              title: 'Easy Download',
              desc: 'Download your favorite content instantly and offline',
            },
          ].map((feature, i) => (
            <div key={i} className="text-center">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="heading-3 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
