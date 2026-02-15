import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { FiMenu, FiX, FiBook, FiHome, FiSearch, FiUser, FiLogOut, FiUpload } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { label: 'Home', path: '/', icon: <FiHome /> },
    { label: 'Books', path: '/books', icon: <FiBook /> },
    { label: 'Digital Content', path: '/digital-content', icon: <FiBook /> },
    { label: 'Search', path: '/search', icon: <FiSearch /> },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <FiBook className="text-2xl" />
            <span className="hidden sm:block">Library</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-700 hover:text-indigo-600 transition-colors flex items-center gap-1"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side - Auth */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {(user.role === 'librarian' || user.role === 'admin') && (
                  <button
                    onClick={() => navigate('/upload')}
                    className="flex items-center gap-2 btn btn-primary"
                  >
                    <FiUpload />
                    Upload
                  </button>
                )}
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600"
                >
                  <FiUser />
                  {user.name}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <FiLogOut />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t pt-2 mt-2">
              {user ? (
                  <>
                  {(user.role === 'librarian' || user.role === 'admin') && (
                    <button
                      onClick={() => {
                        navigate('/upload');
                        setIsOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded"
                    >
                      Upload Content
                    </button>
                  )}
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
