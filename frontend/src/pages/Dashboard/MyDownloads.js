import React, { useState, useEffect } from 'react';
import { FiDownload, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { authAPI, digitalContentAPI } from '../../services/api';

const MyDownloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        setLoading(true);
        const response = await authAPI.getMeDownloads();
        
        if (response.data.success) {
          setDownloads(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching downloads:', error);
        toast.error('Failed to load downloads');
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, []);

  const handleReDownload = async (id) => {
    try {
      const response = await digitalContentAPI.downloadContent(id);
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `content-${id}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  const handleRemove = (id) => {
    if (window.confirm('Remove this download from your list?')) {
      setDownloads(downloads.filter(d => d._id !== id));
      toast.success('Download removed from your list');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="heading-2 mb-2">My Downloads</h1>
        <p className="text-gray-600">Manage your downloaded digital content</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <FiDownload className="text-6xl text-gray-300 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading your downloads...</p>
        </div>
      ) : downloads.length > 0 ? (
        <div className="space-y-4">
          {downloads.map((download) => (
            <div key={download._id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-grow">
                  <div className="bg-green-100 rounded-lg p-4">
                    <FiDownload className="text-2xl text-green-600" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg">{download.title}</h3>
                    <p className="text-gray-600">{download.author}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span className="capitalize">{download.type || 'Document'}</span>
                      {download.subject && <span>{download.subject}</span>}
                      {download.category && <span>{download.category}</span>}
                      {download.downloadDate && <span>Downloaded: {formatDate(download.downloadDate)}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReDownload(download._id)}
                    className="btn btn-primary px-4 py-2 flex items-center gap-2"
                  >
                    <FiDownload size={16} />
                    Re-download
                  </button>
                  <button
                    onClick={() => handleRemove(download._id)}
                    className="btn btn-danger px-4 py-2"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <FiDownload className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-4">You haven't downloaded any content yet</p>
          <a href="/digital-content" className="btn btn-primary">
            Browse Digital Content
          </a>
        </div>
      )}
    </div>
  );
};

export default MyDownloads;
