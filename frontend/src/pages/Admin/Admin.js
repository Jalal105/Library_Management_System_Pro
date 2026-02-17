import React, { useEffect, useState } from 'react';
import { FiUsers, FiBook, FiDownload, FiBarChart2, FiHardDrive } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { digitalContentAPI } from '../../services/api';
import useAuthStore from '../../stores/authStore';

const Admin = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalContent: 0,
    totalDownloads: 0,
  });
  const [storageInfo, setStorageInfo] = useState(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      return;
    }

    const fetchStats = async () => {
      try {
        // Fetch storage info
        const storageRes = await digitalContentAPI.getStorageInfo();
        setStorageInfo(storageRes.data.data);

        // Simulated stats
        setStats({
          totalUsers: 150,
          totalContent: 845,
          totalDownloads: 5230,
        });
      } catch (error) {
        toast.error('Failed to load admin statistics');
      }
    };

    fetchStats();
  }, [user]);

  if (user?.role !== 'admin') {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-600 text-lg">Access denied. Admin only.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="heading-2 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage library system and view statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Users</h3>
            <FiUsers className="text-4xl opacity-30" />
          </div>
          <p className="text-4xl font-bold">{stats.totalUsers}</p>
          <p className="text-blue-100 text-sm mt-2">Registered users</p>
        </div>

        <div className="card p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Content</h3>
            <FiBook className="text-4xl opacity-30" />
          </div>
          <p className="text-4xl font-bold">{stats.totalContent}</p>
          <p className="text-green-100 text-sm mt-2">Books & digital items</p>
        </div>

        <div className="card p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Downloads</h3>
            <FiDownload className="text-4xl opacity-30" />
          </div>
          <p className="text-4xl font-bold">{stats.totalDownloads}</p>
          <p className="text-purple-100 text-sm mt-2">This month</p>
        </div>
      </div>

      {/* Storage Info */}
      {storageInfo && (
        <div className="card p-6">
          <h3 className="heading-3 mb-6 flex items-center gap-2">
            <FiHardDrive />
            Storage Management
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-900">Storage Used</p>
                <p className="text-gray-600">{storageInfo.totalSizeMB} MB / 5000 MB</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${storageInfo.percentUsed}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {storageInfo.percentUsed}% used • {storageInfo.remainingMB} MB remaining
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm">Total Files</p>
                <p className="text-2xl font-bold text-gray-900">{storageInfo.totalFiles}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm">DB Size</p>
                <p className="text-2xl font-bold text-gray-900">{storageInfo.dbTotalSize}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm">Used (MB)</p>
                <p className="text-2xl font-bold text-gray-900">{storageInfo.totalSizeMB}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm">Remaining (MB)</p>
                <p className="text-2xl font-bold text-gray-900">{storageInfo.remainingMB}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Actions */}
      <div className="card p-6">
        <h3 className="heading-3 mb-6 flex items-center gap-2">
          <FiBarChart2 />
          System Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="btn btn-secondary py-3">View User Analytics</button>
          <button className="btn btn-secondary py-3">Generate Reports</button>
          <button className="btn btn-secondary py-3">Backup Database</button>
          <button className="btn btn-secondary py-3">System Settings</button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
