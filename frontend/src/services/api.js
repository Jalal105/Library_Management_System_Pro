import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  getMeBorrowedBooks: () => api.get('/auth/me/borrowed-books'),
  getMeDownloads: () => api.get('/auth/me/downloads'),
};

// Books API
export const booksAPI = {
  getAllBooks: (params) => api.get('/books', { params }),
  getBookById: (id) => api.get(`/books/${id}`),
  searchBooks: (query) => api.get('/books/search', { params: { query } }),
  createBook: (data) => api.post('/books', data),
  uploadBook: (formData) =>
    api.post('/books/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateBook: (id, data) => api.put(`/books/${id}`, data),
  deleteBook: (id) => api.delete(`/books/${id}`),
  borrowBook: (id) => api.post(`/books/${id}/borrow`),
  returnBook: (id) => api.post(`/books/${id}/return`),
};

// Digital Content API
export const digitalContentAPI = {
  getAllContent: (params) => api.get('/digital-content', { params }),
  getContentById: (id) => api.get(`/digital-content/${id}`),
  searchContent: (query, filters) =>
    api.get('/digital-content/search', { params: { query, filters } }),
  uploadContent: (formData) =>
    api.post('/digital-content/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateContent: (id, data) => api.put(`/digital-content/${id}`, data),
  deleteContent: (id) => api.delete(`/digital-content/${id}`),
  downloadContent: (id) => api.get(`/digital-content/${id}/download`, {
    responseType: 'blob',
  }),
  addReview: (id, data) => api.post(`/digital-content/${id}/review`, data),
  getTrending: (params) => api.get('/digital-content/trending', { params }),
  getRecommended: (params) => api.get('/digital-content/recommended', { params }),
  browseByCategory: (category, params) =>
    api.get(`/digital-content/browse/category/${category}`, { params }),
  getStorageInfo: () => api.get('/digital-content/storage/info'),
};

// Users API
export const usersAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export default api;
