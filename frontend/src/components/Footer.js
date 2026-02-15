import React from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiFacebook, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-200 mt-16">
      <div className="container-responsive py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FiBook className="text-2xl text-indigo-400" />
              <span className="font-bold text-lg text-white">Library System</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your digital library management platform for books and digital content.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-indigo-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/books" className="text-gray-400 hover:text-indigo-400 transition">
                  Books
                </Link>
              </li>
              <li>
                <Link to="/digital-content" className="text-gray-400 hover:text-indigo-400 transition">
                  Digital Content
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-400 hover:text-indigo-400 transition">
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#help" className="text-gray-400 hover:text-indigo-400 transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-400 hover:text-indigo-400 transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#terms" className="text-gray-400 hover:text-indigo-400 transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-gray-400 hover:text-indigo-400 transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-4">Connect</h4>
            <div className="flex gap-4 mb-4">
              <a href="#facebook" className="text-gray-400 hover:text-indigo-400 transition">
                <FiFacebook size={20} />
              </a>
              <a href="#twitter" className="text-gray-400 hover:text-indigo-400 transition">
                <FiTwitter size={20} />
              </a>
              <a href="#instagram" className="text-gray-400 hover:text-indigo-400 transition">
                <FiInstagram size={20} />
              </a>
              <a href="#email" className="text-gray-400 hover:text-indigo-400 transition">
                <FiMail size={20} />
              </a>
            </div>
            <p className="text-sm text-gray-400">contact@library.com</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Library Management System. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              Made with <span className="text-red-500">♥</span> for readers everywhere
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
