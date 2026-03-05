import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Folder,
  FolderOpen,
  Edit2, 
  Trash2, 
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Check,
  Video,
  FileText,
  Calendar,
  Eye,
  MoreVertical,
  Clock
} from 'lucide-react';
import API from '../api/api';

const Categories = () => {
  // State for categories list
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  // State for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Form states
  const [addForm, setAddForm] = useState({
    name: '',
    description: '',
    slug: '',
    isActive: true,
  });
  
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    slug: '',
    isActive: true,
  });
  
  const [slugInput, setSlugInput] = useState('');

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Mock data for demo - replace with actual API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await API.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

  // Selection handling
  const handleSelectCategory = (id) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter(categoryId => categoryId !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === currentCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(currentCategories.map(category => category.id));
    }
  };

  // Add category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await API.post('/categories/create', addForm);
      if(response.status === 201){
        setCategories([response.data, ...categories]);

        setShowAddModal(false)
        resetAddForm();
      }
      
    } catch (error) {
      console.error('Error adding category:', error);
    } finally {
      setLoading(false);
    }
  };

  // Edit category
  const handleEditCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setCategories(categories.map(category =>
        category.id === selectedCategory.id
          ? { ...category, ...editForm }
          : category
      ));
      
      setShowEditModal(false);
      setSelectedCategory(null);
      
      // Actual API call:
      // const response = await API.put(`/categories/${selectedCategory.id}`, editForm);
      // setCategories(categories.map(c => c.id === selectedCategory.id ? response.data : c));
    } catch (error) {
      console.error('Error editing category:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setCategories(categories.filter(category => category.id !== selectedCategory));
      setShowDeleteModal(false);
      setSelectedCategory(null);
      
      // Actual API call:
      // await API.delete(`/categories/${selectedCategory}`);
      // setCategories(categories.filter(c => c.id !== selectedCategory));
    } catch (error) {
      console.error('Error deleting category:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete selected categories
  const handleDeleteSelected = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setCategories(categories.filter(category => !selectedCategories.includes(category.id)));
      setSelectedCategories([]);
      
      // Actual API call:
      // await API.delete('/categories/bulk', { data: { ids: selectedCategories } });
    } catch (error) {
      console.error('Error deleting categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal
  const openEditModal = (category) => {
    setSelectedCategory(category);
    setEditForm({
      name: category.name,
      description: category.description,
      slug: category.slug,
      isActive: category.isActive,
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowDeleteModal(true);
  };

  // Reset add form
  const resetAddForm = () => {
    setAddForm({
      name: '',
      description: '',
      slug: '',
      isActive: true,
    });
  };

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  // Handle name change (auto-generate slug)
  const handleNameChange = (e, formType) => {
    const name = e.target.value;
    if (formType === 'add') {
      setAddForm({
        ...addForm,
        name: name,
        slug: generateSlug(name),
      });
    } else {
      setEditForm({
        ...editForm,
        name: name,
        slug: generateSlug(name),
      });
    }
  };

  // Handle slug change
  const handleSlugChange = (e, formType) => {
    const slug = e.target.value
      .toLowerCase()
      .replace(/[^\w-]/g, '')
      .replace(/\s+/g, '-');
    
    if (formType === 'add') {
      setAddForm({ ...addForm, slug });
    } else {
      setEditForm({ ...editForm, slug });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-600">Organize videos into categories</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-sm hover:shadow-md"
        >
          <Plus size={18} className="mr-2" />
          Add New Category
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Folder size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.filter(c => c.isActive).length}
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
              <p className="text-sm text-gray-600">Total Videos</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.reduce((sum, cat) => sum + cat.videoCount, 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Video size={20} className="text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Selected</p>
              <p className="text-2xl font-bold text-gray-900">{selectedCategories.length}</p>
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
              placeholder="Search categories by name, description, or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <select className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            {selectedCategories.length > 0 && (
              <>
                <button
                  onClick={handleDeleteSelected}
                  className="flex items-center px-4 py-2.5 bg-red-50 text-red-700 font-medium rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={18} className="mr-2" />
                  Delete Selected
                </button>
                
                <button
                  className="flex items-center px-4 py-2.5 bg-green-50 text-green-700 font-medium rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Check size={18} className="mr-2" />
                  Activate Selected
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Categories Grid/List View */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6">
                  <input
                    type="checkbox"
                    checked={selectedCategories.length === currentCategories.length && currentCategories.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Videos
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
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
                    <p className="mt-2 text-gray-500">Loading categories...</p>
                  </td>
                </tr>
              ) : currentCategories.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <Folder size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">No categories found</p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="mt-3 text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Create your first category
                    </button>
                  </td>
                </tr>
              ) : (
                currentCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleSelectCategory(category.id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className={`p-2.5 rounded-lg mr-4 ${
                          category.status === "active" ? 'bg-blue-50' : 'bg-gray-50'
                        }`}>
                          {category.status === "active" ? (
                            <FolderOpen size={20} className="text-blue-600" />
                          ) : (
                            <Folder size={20} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                          <div className="text-xs text-gray-500 mt-1 max-w-xs">
                            {category.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <code className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700 font-mono">
                        {category.slug}
                      </code>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <Video size={14} className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{category.videoCount}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        category.status === "active"
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.status === "active" ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar size={14} className="text-gray-400 mr-2" />
                        {new Date(category.updatedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(category.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="View Videos"
                        >
                          <Eye size={16} />
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
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredCategories.length)}
              </span>{' '}
              of <span className="font-medium">{filteredCategories.length}</span> results
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

      {/* Category Cards View (Alternative - Hidden by default, can be toggled) */}
      <div className="hidden grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${category.isActive ? 'bg-blue-50' : 'bg-gray-50'}`}>
                {category.isActive ? (
                  <FolderOpen size={24} className="text-blue-600" />
                ) : (
                  <Folder size={24} className="text-gray-400" />
                )}
              </div>
              <div className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleSelectCategory(category.id)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{category.description}</p>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Slug:</span>
                <code className="px-2 py-1 bg-gray-100 rounded text-gray-700 font-mono text-xs">
                  {category.slug}
                </code>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Videos:</span>
                <span className="font-medium">{category.videoCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Status:</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  category.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                Updated {new Date(category.lastUpdated).toLocaleDateString()}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openEditModal(category)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => openDeleteModal(category.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Add New Category</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleAddCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={addForm.name}
                  onChange={(e) => handleNameChange(e, 'add')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter category name"
                />
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
                  placeholder="Enter category description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={addForm.slug}
                    onChange={(e) => handleSlugChange(e, 'add')}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="category-slug"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  URL-friendly version of the name. Lowercase, letters, numbers, and hyphens only.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={addForm.isActive}
                      onChange={() => setAddForm({ ...addForm, isActive: true })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!addForm.isActive}
                      onChange={() => setAddForm({ ...addForm, isActive: false })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-gray-700">Inactive</span>
                  </label>
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
                  {loading ? 'Adding...' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Edit Category</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleEditCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => handleNameChange(e, 'edit')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={editForm.slug}
                    onChange={(e) => handleSlugChange(e, 'edit')}
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
                      checked={editForm.isActive}
                      onChange={() => setEditForm({ ...editForm, isActive: true })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!editForm.isActive}
                      onChange={() => setEditForm({ ...editForm, isActive: false })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-gray-700">Inactive</span>
                  </label>
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
                <h3 className="text-lg font-semibold text-gray-900">Delete Category</h3>
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
                Are you sure you want to delete this category? This action cannot be undone.
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
                  onClick={handleDeleteCategory}
                  disabled={loading}
                  className="px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-70"
                >
                  {loading ? 'Deleting...' : 'Delete Category'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;