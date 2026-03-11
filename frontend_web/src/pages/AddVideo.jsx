// components/AddVideo.jsx
import React, { useState, useEffect } from 'react';
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
  Loader2,
  Youtube,
  Image as ImageIcon,
  Play,
  Trash2
} from 'lucide-react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

const AddVideo = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    source: 'youtube',
    videoUrl: '',
    thumbnailUrl: '',
    video: null,
    thumbnail: null,
    tags: [],
    isPublished: true,
  });
  
  const [tagInput, setTagInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploadStep, setUploadStep] = useState(1); // 1: details, 2: upload, 3: preview

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await API.get('/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-preview YouTube URL
    if (name === 'videoUrl' && formData.source === 'youtube') {
      const youtubeId = extractYouTubeId(value);
      if (youtubeId) {
        setVideoPreview(`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`);
      }
    }
  };

  // Handle status change
  const handleStatusChange = (isPublished) => {
    setFormData(prev => ({
      ...prev,
      isPublished
    }));
  };

  // Handle source change
  const handleSourceChange = (source) => {
    setFormData(prev => ({
      ...prev,
      source,
      videoUrl: '',
      video: null,
      thumbnailUrl: '',
      thumbnail: null
    }));
    setVideoPreview(null);
    setThumbnailPreview(null);
    setUploadProgress(0);
  };

  // Handle video file upload
  const handleVideoFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file');
      return;
    }

    // Validate file size (100MB max)
    if (file.size > 100 * 1024 * 1024) {
      setError('Video file size must be less than 100MB');
      return;
    }

    setFormData(prev => ({ ...prev, video: file }));
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
    
    // Simulate upload progress
    setUploadStep(2);
    simulateUpload();
  };

  // Handle thumbnail file upload
  const handleThumbnailFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    setFormData(prev => ({ ...prev, thumbnail: file }));
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setThumbnailPreview(previewUrl);
  };

  // Simulate upload progress
  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStep(3);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  // Get YouTube embed URL
  const getYouTubeEmbedUrl = () => {
    const videoId = extractYouTubeId(formData.videoUrl);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
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

  // Handle tag key press
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      
      if (formData.source === 'youtube') {
        // YouTube submission
        const videoData = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          source: formData.source,
          videoUrl: formData.videoUrl,
          thumbnailUrl: formData.thumbnailUrl,
          tags: formData.tags,
          status: formData.isPublished ? 'published' : 'draft'
        };
        response = await API.post('/videos/create', videoData);
      } else {
        // Upload submission
        const formDataObj = new FormData();
        formDataObj.append('title', formData.title);
        formDataObj.append('description', formData.description);
        formDataObj.append('category', formData.category);
        formDataObj.append('source', formData.source);
        formDataObj.append('status', formData.isPublished ? 'published' : 'draft');
        formDataObj.append('tags', JSON.stringify(formData.tags));
        
        if (formData.video) {
          formDataObj.append('video', formData.video);
        }
        if (formData.thumbnail) {
          formDataObj.append('thumbnail', formData.thumbnail);
        }
        
        response = await API.post('/videos/create', formDataObj, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        });
      }
      
      // Navigate to videos list on success
      navigate('/videos');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create video');
      console.error('Error creating video:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle discard
  const handleDiscard = () => {
    if (window.confirm('Are you sure you want to discard all changes?')) {
      navigate('/videos');
    }
  };

  // Reset upload step
  const resetUpload = () => {
    setFormData(prev => ({
      ...prev,
      video: null,
      thumbnail: null
    }));
    setVideoPreview(null);
    setThumbnailPreview(null);
    setUploadProgress(0);
    setUploadStep(1);
  };

  const youtubeEmbedUrl = getYouTubeEmbedUrl();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
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
                <h1 className="text-2xl font-bold text-gray-900">Add New Video</h1>
                <p className="text-gray-600">Upload and publish your video content</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <Upload size={12} className="mr-1.5" />
                {formData.source === 'youtube' ? 'YouTube' : 'Upload'}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Video Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Preview Card */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Video Preview</h2>
                <p className="text-sm text-gray-500 mt-1">Preview how your video will look</p>
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
                ) : formData.source === 'upload' && videoPreview ? (
                  <div className="relative pb-[56.25%] h-0 rounded-lg overflow-hidden bg-gray-900">
                    <video
                      src={videoPreview}
                      poster={thumbnailPreview}
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

                {/* Upload Progress Bar */}
                {formData.source === 'upload' && uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Uploading...</span>
                      <span className="text-sm text-gray-500">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Video Info */}
                {formData.title && (
                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-gray-900">{formData.title}</h3>
                    {formData.description && (
                      <p className="text-gray-600 mt-2 line-clamp-2">{formData.description}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Preview */}
            {(thumbnailPreview || formData.thumbnailUrl) && (
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Thumbnail Preview</h2>
                </div>
                <div className="p-6">
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={thumbnailPreview || formData.thumbnailUrl}
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

          {/* Right Column - Upload Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 sticky top-24">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Video Details</h2>
                <p className="text-sm text-gray-500 mt-1">Fill in the information below</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Source Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Source <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSourceChange('youtube')}
                      className={`flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-all ${
                        formData.source === 'youtube'
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <Youtube size={18} className="mr-2" />
                      YouTube
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSourceChange('upload')}
                      className={`flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-all ${
                        formData.source === 'upload'
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <Upload size={18} className="mr-2" />
                      Upload
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="e.g., My Awesome Video"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select a category</option>
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
                    placeholder="Tell viewers about your video..."
                  />
                </div>

                {/* Source-specific fields */}
                {formData.source === 'youtube' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        YouTube URL <span className="text-red-500">*</span>
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
                          <ImageIcon size={16} className="text-gray-400" />
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
                    {/* Video Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video File <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="video/*"
                          required={!formData.video}
                          onChange={handleVideoFile}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                      </div>
                      {formData.video && (
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {formData.video.name}
                          </span>
                          <button
                            type="button"
                            onClick={resetUpload}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                      <p className="mt-1 text-xs text-gray-400">
                        Max file size: 100MB. Supported formats: MP4, MOV, AVI, etc.
                      </p>
                    </div>

                    {/* Thumbnail Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thumbnail Image
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailFile}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                      </div>
                      {formData.thumbnail && (
                        <p className="mt-1 text-sm text-gray-500">
                          {formData.thumbnail.name}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Status
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.isPublished}
                        onChange={() => handleStatusChange(true)}
                        className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <div className="ml-3">
                        <div className="flex items-center">
                          <CheckCircle size={16} className="text-green-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">Published</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Video will be visible to all users immediately
                        </p>
                      </div>
                    </label>
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="radio"
                        checked={!formData.isPublished}
                        onChange={() => handleStatusChange(false)}
                        className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <div className="ml-3">
                        <div className="flex items-center">
                          <XCircle size={16} className="text-yellow-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">Draft</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Video will be saved as draft, not visible to users
                        </p>
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
                      className="w-full pl-10 pr-16 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      placeholder="Add tags"
                    />
                    <button
                      type="button"
                      onClick={() => addTag(tagInput)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex flex-col space-y-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin mr-2" />
                          Creating Video...
                        </>
                      ) : (
                        <>
                          <Upload size={18} className="mr-2" />
                          {formData.source === 'upload' ? 'Upload & Publish' : 'Add Video'}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleDiscard}
                      disabled={loading}
                      className="w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVideo;