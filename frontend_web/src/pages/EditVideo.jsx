import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Video, 
  ArrowLeft,
  Save,
  X,
  Link,
  Upload,
  Tag,
  File,
  Clock,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import API from '../api/api';

const EditVideo = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  
  // State for video data
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    source: 'youtube',
    videoUrl: '',
    thumbnailUrl: '',
    tags: [],
    isPublished: true,
  });
  
  const [tagInput, setTagInput] = useState('');
  
  // Fetch video data on component mount
  useEffect(() => {
    fetchVideo();
  }, [videoId]);

  // Fetch video from API
  const fetchVideo = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await API.get(`/videos/${videoId}`);
      const videoData = response.data;
      
      setVideo(videoData);
      setFormData({
        title: videoData.title || '',
        description: videoData.description || '',
        category: videoData.category?._id || videoData.category || '',
        source: videoData.source || 'youtube',

        // ✅ append full URL
        videoUrl: videoData.videoUrl
          ? `${import.meta.env.VITE_BACKEND}${videoData.videoUrl}`
          : '',

        thumbnailUrl: videoData.thumbnailUrl
          ? `${import.meta.env.VITE_BACKEND}${videoData.thumbnailUrl}`
          : '',

        tags: videoData.tags || [],
        isPublished: videoData.status === 'published',
      });
    } catch (err) {
      setError('Failed to load video data');
      console.error('Error fetching video:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle checkbox/radio changes
  const handleStatusChange = (isPublished) => {
    setFormData(prev => ({
      ...prev,
      isPublished
    }));
  };

  // Add tag
  const addTag = (tag) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setTagInput('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle tag input key press
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url) => {
    if (!url) return null;
    
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  // Generate YouTube embed URL
  const getYouTubeEmbedUrl = () => {
    if (formData.source !== 'youtube' || !formData.videoUrl) return null;
    
    const videoId = extractYouTubeId(formData.videoUrl);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Prepare data for API
      const updateData = {
        ...formData,
        status: formData.isPublished ? 'published' : 'draft',
        // If you need to handle file uploads separately, you might need FormData
      };

      // Send update request
      await API.put(`/videos/edit/${videoId}`, updateData);
      
      // Redirect to videos list
      navigate('/videos');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update video');
      console.error('Error updating video:', err);
    } finally {
      setSaving(false);
    }
  };

  // Handle discard
  const handleDiscard = () => {
    if (window.confirm('Are you sure you want to discard changes?')) {
      navigate('/videos');
    }
  };

  // Mock categories - replace with actual API call
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await API.get('/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    
    fetchCategories();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading video data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !video) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Video</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/videos')}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Videos
          </button>
        </div>
      </div>
    );
  }

  const youtubeEmbedUrl = getYouTubeEmbedUrl();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/videos')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Video</h1>
                <p className="text-gray-600">Update video information and settings</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                video?.status === 'published' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {video?.status === 'published' ? (
                  <CheckCircle size={12} className="mr-1.5" />
                ) : (
                  <XCircle size={12} className="mr-1.5" />
                )}
                {video?.status === 'published' ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle size={18} className="text-red-500 mr-3 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="h-fit grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Video Preview */}
          <div className="h-fit sticky top-1 lg:col-span-2 space-y-6 overflow-y-auto">
            {/* Video Player */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Video Preview</h2>
              </div>
              
              <div className="p-6">
                {formData.source === 'youtube' && youtubeEmbedUrl ? (
                  <div className="relative pb-[56.25%] h-0 rounded-lg overflow-hidden bg-gray-900">
                    <iframe
                      src={youtubeEmbedUrl}
                      title="YouTube video player"
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : formData.source === 'upload' && formData.videoUrl ? (
                  <div className="relative pb-[56.25%] h-0 rounded-lg overflow-hidden bg-gray-900">
                    <video
                      src={formData.videoUrl}
                      poster={formData.thumbnailUrl}
                      className="absolute top-0 left-0 w-full h-full"
                      controls
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex flex-col items-center justify-center p-8">
                    <Video size={48} className="text-gray-400 mb-4" />
                    <p className="text-gray-500 text-center">
                      {formData.source === 'youtube' 
                        ? 'Enter a YouTube URL to preview the video' 
                        : 'Upload a video file to preview'}
                    </p>
                  </div>
                )}
                
                {/* Video Info Below Player */}
                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{formData.title || 'Untitled Video'}</h3>
                    <div className="flex items-center space-x-4 mt-2">
                      {video?.views !== undefined && (
                        <div className="flex items-center text-gray-500">
                          <Eye size={14} className="mr-1.5" />
                          <span className="text-sm">{video.views.toLocaleString()} views</span>
                        </div>
                      )}
                      {video?.duration && (
                        <div className="flex items-center text-gray-500">
                          <Clock size={14} className="mr-1.5" />
                          <span className="text-sm">{video.duration}</span>
                        </div>
                      )}
                      {video?.createdAt && (
                        <div className="flex items-center text-gray-500">
                          <Calendar size={14} className="mr-1.5" />
                          <span className="text-sm">
                            {new Date(video.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                    <p className="text-gray-600 whitespace-pre-line">
                      {formData.description || 'No description provided'}
                    </p>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Thumbnail Preview */}
            {formData.thumbnailUrl && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Thumbnail Preview</h2>
                </div>
                <div className="p-6">
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={formData.thumbnailUrl}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/1280x720?text=Thumbnail+Not+Found';
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Edit Form */}
          <div className="h-fit lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Video Details</h2>
                <p className="text-sm text-gray-500 mt-1">Update video information</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Video Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="Enter video title"
                  />
                </div>
                
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Enter video description"
                  />
                </div>
                
                {/* Source */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source *
                  </label>
                  <select
                    name="source"
                    required
                    value={formData.source}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="upload">Upload</option>
                  </select>
                </div>
                
                {/* Source-specific fields */}
                {formData.source === 'youtube' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        YouTube URL *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Link size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="url"
                          name="videoUrl"
                          required
                          value={formData.videoUrl}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                          placeholder="https://youtube.com/watch?v=..."
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
                          name="thumbnailUrl"
                          value={formData.thumbnailUrl}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                          placeholder="https://example.com/thumbnail.jpg"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {formData.source === 'upload' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video File
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <File size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            // Handle file upload - you might want to upload to S3 first
                            const file = e.target.files[0];
                            if (file) {
                              // Set a temporary URL or upload to S3
                              const tempUrl = URL.createObjectURL(file);
                              setFormData(prev => ({ ...prev, videoUrl: tempUrl }));
                            }
                          }}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Current: {formData.videoUrl ? 'Video uploaded' : 'No video file'}
                      </p>
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
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const tempUrl = URL.createObjectURL(file);
                              setFormData(prev => ({ ...prev, thumbnailUrl: tempUrl }));
                            }
                          }}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Current: {formData.thumbnailUrl ? 'Thumbnail uploaded' : 'No thumbnail'}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.isPublished}
                        onChange={() => handleStatusChange(true)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <div className="ml-2">
                        <div className="flex items-center">
                          <CheckCircle size={16} className="text-green-500 mr-2" />
                          <span className="text-gray-700">Published</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Video will be visible to users</p>
                      </div>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        checked={!formData.isPublished}
                        onChange={() => handleStatusChange(false)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <div className="ml-2">
                        <div className="flex items-center">
                          <XCircle size={16} className="text-red-500 mr-2" />
                          <span className="text-gray-700">Draft</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Video will be hidden from users</p>
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
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
                      onKeyPress={handleTagKeyPress}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      placeholder="Type tag and press Enter"
                    />
                    <button
                      type="button"
                      onClick={() => addTag(tagInput)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleDiscard}
                      disabled={saving}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                    >
                      {saving ? (
                        <>
                          <Loader2 size={18} className="animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} className="mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
            
            {/* Video Info Summary */}
            <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Video Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Video ID:</span>
                  <code className="font-mono text-gray-900">{videoId}</code>
                </div>
                {video?.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created:</span>
                    <span className="text-gray-900">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {video?.updatedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Updated:</span>
                    <span className="text-gray-900">
                      {new Date(video.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {video?.views !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Views:</span>
                    <span className="text-gray-900">{video.views.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditVideo;