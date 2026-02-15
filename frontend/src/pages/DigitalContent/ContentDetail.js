import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiBook, FiArrowLeft, FiDownload, FiEye, FiStar, FiAward, FiMessageSquare } from 'react-icons/fi';
import { digitalContentAPI } from '../../services/api';
import useAuthStore from '../../stores/authStore';

const ContentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await digitalContentAPI.getContentById(id);
        setContent(response.data.data);
      } catch (error) {
        toast.error('Failed to load content details');
        navigate('/digital-content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id, navigate]);

  const handleDownload = async () => {
    if (!user) {
      toast.error('Please login to download');
      navigate('/login');
      return;
    }

    try {
      setDownloading(true);
      const response = await digitalContentAPI.downloadContent(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', content.file.originalName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success('Download started!');
    } catch (error) {
      toast.error('Failed to download file');
    } finally {
      setDownloading(false);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to review');
      navigate('/login');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      setSubmitting(true);
      await digitalContentAPI.addReview(id, { rating, comment });
      toast.success('Review submitted!');
      setRating(0);
      setComment('');
      // Refresh content
      const response = await digitalContentAPI.getContentById(id);
      setContent(response.data.data);
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

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

  if (!content) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Content not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/digital-content')}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
      >
        <FiArrowLeft />
        Back to Digital Content
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Content Cover */}
        <div className="md:col-span-1">
          <div className="card aspect-[3/4] flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 sticky top-24">
            <FiBook className="text-9xl text-white opacity-30" />
          </div>
        </div>

        {/* Content Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Title & Metadata */}
          <div>
            <div className="flex gap-2 mb-3">
              <span className="inline-block bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                {content.type}
              </span>
              <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
                {content.category}
              </span>
            </div>
            <h1 className="heading-1 mb-2">{content.title}</h1>
            <p className="text-lg text-gray-600 mb-4">by {content.author}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="card p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-indigo-600">
                  <FiEye />
                  {content.views}
                </div>
                <p className="text-sm text-gray-600">Views</p>
              </div>
              <div className="card p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-green-600">
                  <FiDownload />
                  {content.downloads}
                </div>
                <p className="text-sm text-gray-600">Downloads</p>
              </div>
              <div className="card p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-yellow-600">
                  <FiStar />
                  {content.rating.average.toFixed(1)}
                </div>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {content.description && (
            <div>
              <h3 className="heading-3 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{content.description}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            {content.publisher && (
              <div className="card p-4">
                <p className="text-gray-600 text-sm">Publisher</p>
                <p className="font-semibold">{content.publisher}</p>
              </div>
            )}
            {content.publicationYear && (
              <div className="card p-4">
                <p className="text-gray-600 text-sm">Published</p>
                <p className="font-semibold">{content.publicationYear}</p>
              </div>
            )}
            {content.isbn && (
              <div className="card p-4">
                <p className="text-gray-600 text-sm">ISBN</p>
                <p className="font-semibold text-sm break-all">{content.isbn}</p>
              </div>
            )}
            {content.language && (
              <div className="card p-4">
                <p className="text-gray-600 text-sm">Language</p>
                <p className="font-semibold">{content.language}</p>
              </div>
            )}
          </div>

          {/* Keywords & Tags */}
          {(content.keywords?.length > 0 || content.tags?.length > 0) && (
            <div>
              <h4 className="font-semibold mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {content.keywords?.map((kw) => (
                  <span key={kw} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                    #{kw}
                  </span>
                ))}
                {content.tags?.map((tag) => (
                  <span key={tag} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="btn btn-primary w-full py-3 font-semibold text-lg"
          >
            <FiDownload />
            {downloading ? 'Downloading...' : 'Download Content'}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-8">
        <h2 className="heading-2">Reviews & Ratings</h2>

        {/* Add Review */}
        {user ? (
          <form onSubmit={handleReview} className="card p-6">
            <h3 className="heading-3 mb-4">Share Your Review</h3>

            {/* Rating */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRating(r)}
                    className={`text-3xl transition ${
                      r <= rating ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this content..."
              rows={4}
              className="input-field mb-4"
            />

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              <FiMessageSquare />
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <div className="card p-6 text-center">
            <p className="text-gray-600 mb-4">Please login to leave a review</p>
            <button
              onClick={() => navigate('/login')}
              className="btn btn-primary"
            >
              Login to Review
            </button>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          <p className="text-gray-600">
            {content.reviews.length} review{content.reviews.length !== 1 ? 's' : ''}
          </p>
          {content.reviews.length > 0 ? (
            content.reviews.map((review, i) => (
              <div key={i} className="card p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FiAward className="text-indigo-600" />
                    <span className="font-semibold text-gray-900">Anonymous User</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <FiStar key={i} className="text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>
                {review.comment && <p className="text-gray-700">{review.comment}</p>}
              </div>
            ))
          ) : (
            <p className="text-gray-600">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentDetail;
