import React, { useEffect, useState } from 'react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { booksAPI } from '../../services/api';
import useAuthStore from '../../stores/authStore';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await booksAPI.getAllBooks({ limit: 100 });
        setBooks(response.data.data);
      } catch (error) {
        toast.error('Failed to load books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await booksAPI.deleteBook(id);
        setBooks(books.filter(book => book._id !== id));
        toast.success('Book deleted successfully');
      } catch (error) {
        toast.error('Failed to delete book');
      }
    }
  };

  if (!user || (user.role !== 'librarian' && user.role !== 'admin')) {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-600">Only librarians and admins can manage books</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-2">Manage Books</h1>
          <p className="text-gray-600">Edit and remove books from the library</p>
        </div>
        <button className="btn btn-primary">
          <FiPlus />
          Add New Book
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading books...</p>
        </div>
      ) : books.length > 0 ? (
        <div className="overflow-x-auto card">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Author</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Quantity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Available</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {books.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{book.title}</td>
                  <td className="px-6 py-4">{book.author}</td>
                  <td className="px-6 py-4">{book.category}</td>
                  <td className="px-6 py-4">{book.quantity}</td>
                  <td className="px-6 py-4">{book.availableQuantity}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="btn btn-secondary px-3 py-1">
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="btn btn-danger px-3 py-1"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-gray-600 text-lg">No books found</p>
        </div>
      )}
    </div>
  );
};

export default ManageBooks;
