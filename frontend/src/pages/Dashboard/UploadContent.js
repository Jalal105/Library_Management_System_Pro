import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FiUpload } from 'react-icons/fi';
import { digitalContentAPI, booksAPI } from '../../services/api';
import useAuthStore from '../../stores/authStore';

const UploadContent = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState('digital'); // 'digital' or 'book'
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Check if user is librarian or admin
  if (user && user.role !== 'librarian' && user.role !== 'admin') {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-600 text-lg mb-4">
          Only librarians and admins can upload content
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn btn-primary"
        >
          Go Home
        </button>
      </div>
    );
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const onSubmitDigital = async (data) => {
    try {
      if (!file) {
        toast.error('Please select a file');
        return;
      }

      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', data.title);
      formData.append('author', data.author);
      formData.append('type', data.type);
      formData.append('subject', data.subject);
      formData.append('category', data.category);
      formData.append('keywords', data.keywords);
      formData.append('description', data.description);
      if (data.publisher) formData.append('publisher', data.publisher);
      if (data.publicationYear) formData.append('publicationYear', data.publicationYear);
      if (data.isbn) formData.append('isbn', data.isbn);
      if (data.issn) formData.append('issn', data.issn);
      if (data.tags) formData.append('tags', data.tags);
      formData.append('accessLevel', data.accessLevel);

      await digitalContentAPI.uploadContent(formData);

      toast.success('Content uploaded successfully!');
      reset();
      setFile(null);
      navigate('/digital-content');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onSubmitBook = async (data) => {
    try {
      setUploading(true);

      const payload = {
        title: data.title,
        author: data.author,
        isbn: data.isbn,
        description: data.description,
        category: data.category,
        quantity: Number(data.quantity) || 1,
        publicationYear: data.publicationYear || undefined,
        publisher: data.publisher || undefined,
      };

      await booksAPI.createBook(payload);

      toast.success('Book created successfully!');
      reset();
      navigate('/books');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Book creation failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading-2 mb-2">{mode === 'digital' ? 'Upload Digital Content' : 'Create Book'}</h1>
            <p className="text-gray-600">{mode === 'digital' ? 'Add eBooks, journals, papers, and more to the library' : 'Add a physical/book record to the library catalog'}</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setMode('digital')} className={`btn ${mode==='digital' ? 'btn-primary' : 'btn-secondary'}`}>Digital</button>
            <button type="button" onClick={() => setMode('book')} className={`btn ${mode==='book' ? 'btn-primary' : 'btn-secondary'}`}>Book</button>
          </div>
        </div>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleSubmit(mode === 'digital' ? onSubmitDigital : onSubmitBook)} className="card p-8 space-y-6">
        {/* If mode is digital, show file upload, else show book-specific fields */}
        {mode === 'digital' && (
          <>
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select File *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition cursor-pointer">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input"
                  accept=".pdf,.epub,.docx,.doc,.txt,.xlsx,.xls,.jpg,.png,.gif"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <FiUpload className="text-4xl text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">
                    {file ? file.name : 'Click to select file or drag and drop'}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Supported: PDF, EPUB, DOCX, TXT, XLSX, JPG, PNG, GIF (Max 500MB)
                  </p>
                </label>
              </div>
              {file && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ File selected: {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              )}
            </div>
          </>
        )}

        {/* Common fields start here */}
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select File *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition cursor-pointer">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
              accept=".pdf,.epub,.docx,.doc,.txt,.xlsx,.xls,.jpg,.png,.gif"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <FiUpload className="text-4xl text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">
                {file ? file.name : 'Click to select file or drag and drop'}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Supported: PDF, EPUB, DOCX, TXT, XLSX, JPG, PNG, GIF (Max 500MB)
              </p>
            </label>
          </div>
          {file && (
            <p className="text-sm text-green-600 mt-2">
              ✓ File selected: {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            placeholder="Enter content title"
            className="input-field"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author *
          </label>
          <input
            type="text"
            placeholder="Enter author name"
            className="input-field"
            {...register('author', { required: 'Author is required' })}
          />
          {errors.author && (
            <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>
          )}
        </div>

        {/* Type & Subject */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Type *
            </label>
            <select
              className="input-field"
              {...register('type', { required: 'Content type is required' })}
            >
              <option value="">Select type</option>
              <option value="ebook">eBook</option>
              <option value="journal">Journal</option>
              <option value="paper">Paper</option>
              <option value="thesis">Thesis</option>
              <option value="notes">Notes</option>
              <option value="other">Other</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              placeholder="e.g., Computer Science"
              className="input-field"
              {...register('subject', { required: 'Subject is required' })}
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
            )}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            className="input-field"
            {...register('category', { required: 'Category is required' })}
          >
            <option value="">Select category</option>
            <option value="Technology">Technology</option>
            <option value="Science">Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="History">History</option>
            <option value="Literature">Literature</option>
            <option value="Business">Business</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
          )}
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Keywords (comma-separated)
          </label>
          <input
            type="text"
            placeholder="e.g., AI, Machine Learning, Deep Learning"
            className="input-field"
            {...register('keywords')}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            placeholder="Enter content description"
            rows={4}
            className="input-field"
            {...register('description')}
          />
        </div>

        {/* Optional Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Publisher
            </label>
            <input
              type="text"
              placeholder="Publisher name"
              className="input-field"
              {...register('publisher')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Publication Year
            </label>
            <input
              type="number"
              placeholder="YYYY"
              className="input-field"
              {...register('publicationYear')}
            />
          </div>
        </div>

        {/* ISBN & ISSN (digital) or Quantity (book) */}
        {mode === 'digital' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISBN
              </label>
              <input
                type="text"
                placeholder="ISBN"
                className="input-field"
                {...register('isbn')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISSN
              </label>
              <input
                type="text"
                placeholder="ISSN"
                className="input-field"
                {...register('issn')}
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity *
            </label>
            <input
              type="number"
              placeholder="Number of copies"
              className="input-field"
              {...register('quantity', { required: 'Quantity is required for books' })}
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
            )}
          </div>
        )}

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            placeholder="e.g., Featured, Popular, New"
            className="input-field"
            {...register('tags')}
          />
        </div>

        {/* Access Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Access Level
          </label>
          <select
            className="input-field"
            defaultValue="public"
            {...register('accessLevel')}
          >
            <option value="public">Public</option>
            <option value="restricted">Restricted</option>
            <option value="private">Private</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          className="btn btn-primary w-full py-3 font-semibold text-lg"
        >
          <FiUpload />
          {uploading ? (mode === 'digital' ? 'Uploading...' : 'Creating...') : (mode === 'digital' ? 'Upload Content' : 'Create Book')}
        </button>
      </form>
    </div>
  );
};

export default UploadContent;
