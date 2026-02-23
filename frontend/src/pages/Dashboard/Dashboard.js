import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiList, FiDownload, FiUpload, FiSettings, FiBook } from 'react-icons/fi';
import useAuthStore from '../../stores/authStore';
import { authAPI } from '../../services/api';

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [borrowedCount, setBorrowedCount] = useState(0);
  const [downloadsCount, setDownloadsCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [borrowedRes, downloadsRes] = await Promise.all([
          authAPI.getMeBorrowedBooks(),
          authAPI.getMeDownloads(),
        ]);

        if (borrowedRes.data.success) {
          setBorrowedCount(borrowedRes.data.data.length);
        }
        if (downloadsRes.data.success) {
          setDownloadsCount(downloadsRes.data.data.length);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardItems = [
    {
      icon: <FiList className="text-3xl" />,
      title: 'My Library',
      description: 'View your borrowed books and saved items',
      link: '/my-library',
      color: 'from-blue-500 to-blue-600',
      badge: borrowedCount,
    },
    {
      icon: <FiDownload className="text-3xl" />,
      title: 'My Downloads',
      description: 'Access your downloaded digital content',
      link: '/dashboard/downloads',
      color: 'from-green-500 to-green-600',
      badge: downloadsCount,
    },
  ];

  if (user?.role === 'librarian' || user?.role === 'admin') {
    dashboardItems.push(
      {
        icon: <FiUpload className="text-3xl" />,
        title: 'Upload Content',
        description: 'Add new books and digital content',
        link: '/upload',
        color: 'from-purple-500 to-purple-600',
      },
      {
        icon: <FiList className="text-3xl" />,
        title: 'Manage Books',
        description: 'Edit and manage library books',
        link: '/manage-books',
        color: 'from-orange-500 to-orange-600',
      }
    );
  }

  if (user?.role === 'admin') {
    dashboardItems.push({
      icon: <FiSettings className="text-3xl" />,
      title: 'Admin Panel',
      description: 'System settings and analytics',
      link: '/admin',
      color: 'from-red-500 to-red-600',
    });
  }

  return (
    <div className="space-y-8">
      {/* User Profile Card */}
      <div className="card p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h2>
            <p className="text-indigo-100">
              Role: <span className="font-semibold capitalize">{user?.role}</span>
            </p>
          </div>
          <div className="text-6xl opacity-20">👤</div>
        </div>
      </div>

      {/* Dashboard Items */}
      <div>
        <h3 className="heading-3 mb-6">Your Dashboard</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dashboardItems.map((item) => (
            <Link
              key={item.link}
              to={item.link}
              className="card group overflow-hidden hover:shadow-xl transition-all relative"
            >
              {item.badge > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                  {item.badge}
                </div>
              )}
              <div className={`bg-gradient-to-br ${item.color} p-6 text-white`}>
                <div className="group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
              </div>
              <div className="p-6">
                <h4 className="heading-3 mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Account Settings */}
      <div className="card p-8">
        <h3 className="heading-3 mb-6">Account Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Email</p>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
          <hr className="my-4" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Account Type</p>
              <p className="text-gray-600 capitalize">{user?.role}</p>
            </div>
          </div>
          <hr className="my-4" />
          <div className="flex gap-4">
            <button className="btn btn-secondary">Edit Profile</button>
            <button className="btn btn-secondary">Change Password</button>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="btn btn-danger w-full py-3 font-semibold text-lg flex items-center justify-center gap-2"
      >
        <FiLogOut />
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
