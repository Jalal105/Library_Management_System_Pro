import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useAuthStore from './stores/authStore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import BrowseBooks from './pages/Books/BrowseBooks';
import BookDetail from './pages/Books/BookDetail';
import BrowseDigitalContent from './pages/DigitalContent/BrowseDigitalContent';
import ContentDetail from './pages/DigitalContent/ContentDetail';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard/Dashboard';
import MyLibrary from './pages/Dashboard/MyLibrary';
import UploadContent from './pages/Dashboard/UploadContent';
import ManageBooks from './pages/Dashboard/ManageBooks';
import Admin from './pages/Admin/Admin';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container-responsive py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/books" element={<BrowseBooks />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/digital-content" element={<BrowseDigitalContent />} />
            <Route path="/digital-content/:id" element={<ContentDetail />} />
            <Route path="/search" element={<Search />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-library"
              element={
                <PrivateRoute>
                  <MyLibrary />
                </PrivateRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <PrivateRoute allowedRoles={["librarian", "admin"]}>
                  <UploadContent />
                </PrivateRoute>
              }
            />
            <Route
              path="/manage-books"
              element={
                <PrivateRoute>
                  <ManageBooks />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <Admin />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
