import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Video, 
  Edit2, 
  Trash2, 
  Eye, 
  Calendar,
  Clock,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Check,
  Upload,
  Link,
  Tag,
  File,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

const Videos = () => {
  // State for videos list
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const navigate = useNavigate();
  
  // State for modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  
  // Form states
  const [addForm, setAddForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    video: null,
    thumbnailUrl: '',
    thumbnail: null,
    category: '',
    tags: [],
    source: 'youtube',
    isPublished: true,
  });
  
  const [tagInput, setTagInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  // Fetch videos on component mount
  useEffect(() => {
    fetchVideos();
    fetchCategories();
  }, []);

  // Fetch videos from API
  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await API.get('/videos');
      setVideos(response.data.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await API.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Filter videos based on search term and filters
  const filteredVideos = videos.filter(video => {
    const matchesSearch = searchTerm === '' || 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (video.category?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === '' || categoryFilter === 'All' || 
      video.category?._id === categoryFilter || video.category?.name === categoryFilter;
    
    const matchesStatus = statusFilter === '' || video.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentVideos = filteredVideos
    .slice(indexOfFirstItem, indexOfLastItem)
    .map(video => ({
      ...video,
      videoUrl: video.videoUrl?.startsWith("https")
        ? video.videoUrl
        : `${import.meta.env.VITE_BACKEND}${video.videoUrl}`,
      thumbnailUrl: video.thumbnailUrl?.startsWith("https")
        ? video.thumbnailUrl
        : `${import.meta.env.VITE_BACKEND}${video.thumbnailUrl}`,
    }));

  // Selection handling
  const handleSelectVideo = (id) => {
    setSelectedVideos(prev => 
      prev.includes(id) 
        ? prev.filter(videoId => videoId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedVideos.length === currentVideos.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(currentVideos.map(video => video._id));
    }
  };

  // Delete video
  const handleDeleteVideo = async () => {
    setModalLoading(true);
    
    try {
      await API.delete(`/videos/delete/${selectedVideoId}`);
      setVideos(videos.filter(v => v._id !== selectedVideoId));
      setShowDeleteModal(false);
      setSelectedVideoId(null);
    } catch (error) {
      console.error('Error deleting video:', error);
    } finally {
      setModalLoading(false);
    }
  };

  // Delete selected videos
  const handleDeleteSelected = async () => {
    if (!selectedVideos.length) return;
    
    setModalLoading(true);
    
    try {
      await Promise.all(selectedVideos.map(id => 
        API.delete(`/videos/delete/${id}`)
      ));
      setVideos(videos.filter(video => !selectedVideos.includes(video._id)));
      setSelectedVideos([]);
    } catch (error) {
      console.error('Error deleting videos:', error);
    } finally {
      setModalLoading(false);
    }
  };

  // Open delete modal
  const openDeleteModal = (videoId) => {
    setSelectedVideoId(videoId);
    setShowDeleteModal(true);
  };

  // Reset add form
  const resetAddForm = () => {
    setAddForm({
      title: '',
      description: '',
      videoUrl: '',
      video: null,
      thumbnailUrl: '',
      thumbnail: null,
      category: '',
      tags: [],
      source: 'youtube',
      isPublished: true,
    });
    setTagInput('');
  };

  // Add tag to form
  const addTag = (tag) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !addForm.tags.includes(trimmedTag)) {
      setAddForm({ ...addForm, tags: [...addForm.tags, trimmedTag] });
      setTagInput('');
    }
  };

  // Remove tag from form
  const removeTag = (tagToRemove) => {
    setAddForm({ ...addForm, tags: addForm.tags.filter(tag => tag !== tagToRemove) });
  };

  // Handle tag input key press
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  function getYouTubeThumbnail(url) {
    let videoId = null;
    const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/;
    const match = url.match(regex);
    if (match && match[1]) videoId = match[1];
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  // Calculate stats
  const totalViews = videos.reduce((sum, video) => sum + (video.views || 0), 0);
  const publishedCount = videos.filter(v => v.status === 'published').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Video Management</h1>
              <p className="text-gray-600 mt-1">Manage and organize your video content</p>
            </div>
            <button
              onClick={() => navigate('/videos/add')}
              className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-sm"
            >
              <Plus size={18} className="mr-2" />
              Add New Video
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Videos</p>
                <p className="text-2xl font-bold text-gray-900">{videos.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Video size={20} className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">{publishedCount}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Check size={20} className="text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Eye size={20} className="text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selected</p>
                <p className="text-2xl font-bold text-gray-900">{selectedVideos.length}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Filter size={20} className="text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 mb-8">
          <div className="p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="search"
                  placeholder="Search videos by title, category, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-w-[150px]"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-w-[150px]"
                >
                  <option value="">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
                
                {selectedVideos.length > 0 && (
                  <button
                    onClick={handleDeleteSelected}
                    disabled={modalLoading}
                    className="flex items-center px-4 py-2.5 bg-red-50 text-red-700 font-medium rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={18} className="mr-2" />
                    Delete Selected ({selectedVideos.length})
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Videos Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedVideos.length === currentVideos.length && currentVideos.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Video
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center">
                      <Loader2 size={32} className="animate-spin text-indigo-600 mx-auto mb-3" />
                      <p className="text-gray-500">Loading videos...</p>
                    </td>
                  </tr>
                ) : currentVideos.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center">
                      <Video size={48} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500 mb-2">No videos found</p>
                      <button
                        onClick={() => navigate('/videos/add')}
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        Add your first video
                      </button>
                    </td>
                  </tr>
                ) : (
                  currentVideos.map((video) => (
                    <tr key={video._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <input
                          type="checkbox"
                          checked={selectedVideos.includes(video._id)}
                          onChange={() => handleSelectVideo(video._id)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-28 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                            <img
                              src={video.source === "youtube"? getYouTubeThumbnail(video.videoUrl):video.thumbnailUrl}
                              alt={video.title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/160x90?text=Error';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 mb-1">{video.title}</div>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock size={12} className="mr-1" />
                              <span>{video.duration || '00:00'}</span>
                              {video.source === 'youtube' && (
                                <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-800 rounded text-xs">
                                  YouTube
                                </span>
                              )}
                              {video.source === 'upload' && (
                                <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                                  Uploaded
                                </span>
                              )}
                            </div>
                            {video.tags?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {video.tags.slice(0, 2).map((tag, idx) => (
                                  <span key={idx} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                    {tag}
                                  </span>
                                ))}
                                {video.tags.length > 2 && (
                                  <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                    +{video.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {video.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          video.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {video.status === 'published' ? (
                            <CheckCircle size={12} className="mr-1" />
                          ) : (
                            <XCircle size={12} className="mr-1" />
                          )}
                          {video.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <Eye size={14} className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{(video.views || 0).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar size={14} className="text-gray-400 mr-2" />
                          {new Date(video.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigate(`/videos/edit/${video._id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(video._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredVideos.length)}
                </span>{' '}
                of <span className="font-medium">{filteredVideos.length}</span> results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .map((page, i, arr) => (
                      <React.Fragment key={page}>
                        {i > 0 && arr[i - 1] !== page - 1 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Delete Video</h3>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="p-3 bg-red-50 rounded-full">
                  <AlertCircle size={24} className="text-red-600" />
                </div>
              </div>
              
              <p className="text-center text-gray-700 mb-6">
                Are you sure you want to delete this video? This action cannot be undone.
              </p>
              
              <div className="flex justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedVideoId(null);
                  }}
                  disabled={modalLoading}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteVideo}
                  disabled={modalLoading}
                  className="px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-70 flex items-center"
                >
                  {modalLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Video'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;