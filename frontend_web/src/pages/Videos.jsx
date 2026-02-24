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
  File
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

  const navigate = useNavigate();
  
  // State for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  
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
  
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    video: '',
    thumbnailUrl: '',
    category: '',
    tags: [],
    duration: '',
    isPublished: true,
  });

  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  
  const [tagInput, setTagInput] = useState('');
  const [categories, setCategories] = useState([])

  // Fetch videos on component mount
  useEffect(() => {
    fetchVideos();
    fetchCategories();
  }, []);

  // Mock data for demo - replace with actual API
  const fetchVideos = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const mockVideos = [
        // { id: 1, title: 'Getting Started with React', views: 12345, duration: '15:30', uploaded: '2024-01-15', category: 'Programming', tags: ['react', 'javascript', 'frontend'], status: 'published', thumbnail: 'https://picsum.photos/seed/video1/300/200' },
        // { id: 2, title: 'Advanced JavaScript Patterns', views: 8567, duration: '22:15', uploaded: '2024-01-10', category: 'Programming', tags: ['javascript', 'patterns', 'advanced'], status: 'published', thumbnail: 'https://picsum.photos/seed/video2/300/200' },
        // { id: 3, title: 'CSS Grid Complete Guide', views: 23456, duration: '18:45', uploaded: '2024-01-05', category: 'Web Design', tags: ['css', 'grid', 'layout'], status: 'published', thumbnail: 'https://picsum.photos/seed/video3/300/200' },
        // { id: 4, title: 'TypeScript for Beginners', views: 5678, duration: '25:10', uploaded: '2024-01-01', category: 'Programming', tags: ['typescript', 'beginners', 'webdev'], status: 'draft', thumbnail: 'https://picsum.photos/seed/video4/300/200' },
        // { id: 5, title: 'Building REST APIs', views: 9876, duration: '20:30', uploaded: '2023-12-28', category: 'Backend', tags: ['api', 'rest', 'nodejs'], status: 'published', thumbnail: 'https://picsum.photos/seed/video5/300/200' },
        // { id: 6, title: 'UI/UX Design Principles', views: 3456, duration: '14:20', uploaded: '2023-12-25', category: 'Design', tags: ['ui', 'ux', 'design'], status: 'published', thumbnail: 'https://picsum.photos/seed/video6/300/200' },
        // { id: 7, title: 'Mobile App Development', views: 7890, duration: '28:45', uploaded: '2023-12-20', category: 'Mobile', tags: ['react-native', 'mobile', 'app'], status: 'draft', thumbnail: 'https://picsum.photos/seed/video7/300/200' },
        // { id: 8, title: 'Database Optimization', views: 4567, duration: '32:15', uploaded: '2023-12-15', category: 'Database', tags: ['sql', 'optimization', 'performance'], status: 'published', thumbnail: 'https://picsum.photos/seed/video8/300/200' },
        // { id: 9, title: 'Machine Learning Basics', views: 1234, duration: '45:30', uploaded: '2023-12-10', category: 'AI/ML', tags: ['ml', 'ai', 'basics'], status: 'published', thumbnail: 'https://picsum.photos/seed/video9/300/200' },
        // { id: 10, title: 'DevOps Fundamentals', views: 6789, duration: '38:20', uploaded: '2023-12-05', category: 'DevOps', tags: ['devops', 'ci-cd', 'docker'], status: 'published', thumbnail: 'https://picsum.photos/seed/video10/300/200' },
      ];
      const response = await API.get('/videos');
      setVideos(response.data.data);
      
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter videos based on search term
  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentVideos = filteredVideos
    .slice(indexOfFirstItem, indexOfLastItem)
    .map(video => ({
      ...video,
      videoUrl: video.videoUrl.startsWith("http")
        ? video.videoUrl // already full URL
        : `${import.meta.env.VITE_BACKEND}${video.videoUrl}`, // prepend base URL
      thumbnailUrl: video.thumbnailUrl?.startsWith("http")
        ? video.thumbnailUrl
        : `${import.meta.env.VITE_BACKEND}${video.thumbnailUrl}`,
    })
  );

  // Selection handling
  const handleSelectVideo = (id) => {
    if (selectedVideos.includes(id)) {
      setSelectedVideos(selectedVideos.filter(videoId => videoId !== id));
    } else {
      setSelectedVideos([...selectedVideos, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedVideos.length === currentVideos.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(currentVideos.map(video => video.id));
    }
  };

  // Add video
  const handleAddVideo = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const newVideo = {...addForm}     //for source === youtube
      const formData = new FormData();  //for source === s3

      if(addForm.source === "youtube"){
        newVideo.status = newVideo.isPublished ? 'published' : 'draft',
        delete newVideo.isPublished
        delete newVideo.video
        delete newVideo.thumbnail
      }else{
        // formData.append("video", newVideo);
        Object.entries(addForm).forEach(([key, value]) => {
          if (value !== null && value !== '') {
            formData.append(key, value);
          }
        });
      }


      const response = await API.post('/videos/create', addForm.source === "youtube"? newVideo:formData);
      setVideos([response.data, ...videos]);
      
      setShowAddModal(false);
      resetAddForm();
      
    } catch (error) {
      console.error('Error adding video:', error);
    } finally {
      setLoading(false);
    }
  };

  // Edit video
  const handleEditVideo = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setVideos(videos.map(video =>
        video.id === selectedVideo.id
          ? { ...video, ...editForm, status: editForm.isPublished ? 'published' : 'draft' }
          : video
      ));
      
      setShowEditModal(false);
      setSelectedVideo(null);
      
      // Actual API call:
      // const response = await API.put(`/videos/${selectedVideo.id}`, editForm);
      // setVideos(videos.map(v => v.id === selectedVideo.id ? response.data : v));
    } catch (error) {
      console.error('Error editing video:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete video
  const handleDeleteVideo = async () => {
    setLoading(true);
    
    try {
      await API.delete(`/videos/delete/${selectedVideo}`);
      
      setVideos(videos.filter(v => v._id !== selectedVideo));
      setShowDeleteModal(false);
      setSelectedVideo(null);
      
      // Actual API call:
    } catch (error) {
      console.error('Error deleting video:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete selected videos
  const handleDeleteSelected = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setVideos(videos.filter(video => !selectedVideos.includes(video.id)));
      setSelectedVideos([]);
      
      // Actual API call:
      // await API.delete('/videos/bulk', { data: { ids: selectedVideos } });
    } catch (error) {
      console.error('Error deleting videos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal
  const openEditModal = (video) => {
    setSelectedVideo(video);
    setEditForm({
      title: video.title,
      description: video.description || '',
      videoUrl: video.videoUrl || '',
      thumbnailUrl: video.thumbnail || '',
      category: video.category,
      tags: video.tags || [],
      duration: video.duration,
      isPublished: video.status === 'published',
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (videoId) => {
    setSelectedVideo(videoId);
    setShowDeleteModal(true);
  };

  // Reset add form
  const resetAddForm = () => {
    setAddForm({
      title: '',
      description: '',
      videoUrl: '',
      thumbnailUrl: '',
      category: '',
      tags: [],
      duration: '',
      isPublished: true,
    });
    setTagInput('');
  };

  // Add tag to form
  const addTag = (formType, tag) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !addForm.tags.includes(trimmedTag)) {
      if (formType === 'add') {
        setAddForm({ ...addForm, tags: [...addForm.tags, trimmedTag] });
      } else {
        setEditForm({ ...editForm, tags: [...editForm.tags, trimmedTag] });
      }
    }
  };

  // Remove tag from form
  const removeTag = (formType, tagToRemove) => {
    if (formType === 'add') {
      setAddForm({ ...addForm, tags: addForm.tags.filter(tag => tag !== tagToRemove) });
    } else {
      setEditForm({ ...editForm, tags: editForm.tags.filter(tag => tag !== tagToRemove) });
    }
  };

  // Categories for dropdown
  // const categories = ['Programming', 'Web Design', 'Backend', 'Mobile', 'Database', 'DevOps', 'AI/ML', 'Design'];

  const fetchCategories = async()=>{
    const response = await API.get("/categories")
    
    setCategories(response.data)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Video Management</h1>
          <p className="text-gray-600">Manage and organize your video content</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-sm hover:shadow-md"
        >
          <Plus size={18} className="mr-2" />
          Add New Video
        </button>
      </div>

      {/* Stats and Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <p className="text-2xl font-bold text-gray-900">
                {videos.filter(v => v.status === 'published').length}
              </p>
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
              <p className="text-2xl font-bold text-gray-900">
                {videos.reduce((sum, video) => sum + video.views, 0).toLocaleString()}
              </p>
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
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
          
          <div className="flex items-center space-x-3">
            <select className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category.slug}>{category.name}</option>
              ))}
            </select>
            
            <select className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            
            {selectedVideos.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="flex items-center px-4 py-2.5 bg-red-50 text-red-700 font-medium rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 size={18} className="mr-2" />
                Delete Selected
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Videos Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6">
                  <input
                    type="checkbox"
                    checked={selectedVideos.length === currentVideos.length && currentVideos.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Video
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                    <p className="mt-2 text-gray-500">Loading videos...</p>
                  </td>
                </tr>
              ) : currentVideos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <Video size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">No videos found</p>
                  </td>
                </tr>
              ) : (
                // ss
                currentVideos.map((video) => (
                  <tr key={video._id} className="hover:bg-gray-50">
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
                        <div className="flex-shrink-0 h-12 w-20 rounded overflow-hidden bg-gray-100">
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{video.title}</div>
                          <div className="flex items-center mt-1">
                            <Clock size={12} className="text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">{video.duration}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {/* {video.tags.slice(0, 2).map((tag, idx) => (
                              <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {tag}
                              </span>
                            ))}
                            {video.tags.length > 2 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                +{video.tags.length - 2}
                              </span>
                            )} */}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {video.category.name}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        video.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {video.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <Eye size={14} className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{video.views.toLocaleString()}</span>
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
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(video._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                        {/* <button
                          className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={16} />
                        </button> */}
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
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
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
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1)
                )
                .map((page, i, arr) => (
                  <React.Fragment key={page}>
                    {i > 0 && arr[i - 1] !== page - 1 && (
                      <span className="px-2">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 rounded-lg font-medium ${
                        currentPage === page
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Video Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Add New Video</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleAddVideo} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.title}
                    onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter video title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={addForm.category}
                    onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter video description"
                />
              </div>

              {/* Source === Youtube */}
              {addForm.source === "youtube" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Youtube URL *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Link size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="url"
                        required
                        value={addForm.videoUrl}
                        onChange={(e) => setAddForm({ ...addForm, videoUrl: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="https://example.com/video.mp4"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thumbnail URL
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Upload size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="url"
                        value={addForm.thumbnailUrl}
                        onChange={(e) => setAddForm({ ...addForm, thumbnailUrl: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="https://example.com/thumbnail.jpg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Source === S3 */}
              {addForm.source === "upload" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Video *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <File size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="file"
                        name='video'
                        required
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        onChange={(e)=> setAddForm({ ...addForm, video: e.target.files[0] })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thumbnail
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <File size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="file"
                        name='thumbnail'
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        onChange={(e)=> setAddForm({ ...addForm, thumbnail: e.target.files[0] })}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* {addForm.source === "youtube" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Youtube URL *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Link size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="url"
                        required
                        value={addForm.videoUrl}
                        onChange={(e) => setAddForm({ ...addForm, videoUrl: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="https://example.com/video.mp4"
                      />
                    </div>
                  </div>
                )}
                {addForm.source === "upload" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Video *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <File size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="file"
                        required
                        value={addForm.videoUrl}
                        onChange={(e) => setAddForm({ ...addForm, videoUrl: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="https://example.com/video.mp4"
                      />
                    </div>
                  </div>
                )} */}
                
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Upload size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="url"
                      value={addForm.thumbnailUrl}
                      onChange={(e) => setAddForm({ ...addForm, thumbnailUrl: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="https://example.com/thumbnail.jpg"
                    />
                  </div>
                </div> */}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source *
                  </label>
                  <select
                    required
                    value={addForm.source}
                    onChange={(e) => setAddForm({ ...addForm, source: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="youtube">Youtube</option>
                    <option value="upload">Upload</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={addForm.isPublished}
                        onChange={() => setAddForm({ ...addForm, isPublished: true })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-gray-700">Published</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!addForm.isPublished}
                        onChange={() => setAddForm({ ...addForm, isPublished: false })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-gray-700">Draft</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {addForm.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag('add', tag)}
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag('add', tagInput);
                        setTagInput('');
                      }
                    }}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Type tag and press Enter"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 disabled:opacity-70"
                >
                  {loading ? 'Adding...' : 'Add Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Video Modal */}
      {showEditModal && selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Edit Video</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleEditVideo} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Link size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="url"
                      required
                      value={editForm.videoUrl}
                      onChange={(e) => setEditForm({ ...editForm, videoUrl: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Upload size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="url"
                      value={editForm.thumbnailUrl}
                      onChange={(e) => setEditForm({ ...editForm, thumbnailUrl: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (MM:SS) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={editForm.duration}
                      onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={editForm.isPublished}
                        onChange={() => setEditForm({ ...editForm, isPublished: true })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-gray-700">Published</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!editForm.isPublished}
                        onChange={() => setEditForm({ ...editForm, isPublished: false })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-gray-700">Draft</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {editForm.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag('edit', tag)}
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag('edit', tagInput);
                        setTagInput('');
                      }
                    }}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Type tag and press Enter"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 disabled:opacity-70"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Delete Video</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
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
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteVideo}
                  disabled={loading}
                  className="px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-70"
                >
                  {loading ? 'Deleting...' : 'Delete Video'}
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