import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  User, 
  Users as UserIcon,
  Shield,
  ShieldCheck,
  ShieldOff,
  Edit2, 
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  MoreVertical,
  Eye,
  Key,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
  Plus,
  Trash2,
  Phone,
  Globe,
  Clock
} from 'lucide-react';
import API from '../api/api';

const Users = () => {
  // State for users list
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  // State for modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form states
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'editor',
    isActive: true,
  });
  
  // Filter states
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await API.get('/users/users');
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Selection handling
  const handleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(userId => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map(user => user.id));
    }
  };

  // Update user role and status
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await API.put(`/users/edit/${selectedUser._id}`, editForm);
      setUsers(users.map(u => u.id === selectedUser._id ? response.data : u));

    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    setLoading(true);
    
    try {
      await API.delete(`/users/delete/${selectedUser._id}`);
      
      setUsers(users.filter(u => u.id !== selectedUser));
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete selected users
  const handleDeleteSelected = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUsers(users.filter(user => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
      
      // Actual API call:
      // await API.delete('/users/bulk', { data: { ids: selectedUsers } });
    } catch (error) {
      console.error('Error deleting users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal
  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.status === 'active',
    });
    setShowEditModal(true);
  };

  // Open view modal
  const openViewModal = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  // Open delete modal
  const openDeleteModal = (userId) => {
    setSelectedUser(userId);
    setShowDeleteModal(true);
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <ShieldCheck size={14} />;
      case 'editor': return <Edit2 size={14} />;
      case 'viewer': return <Eye size={14} />;
      default: return <User size={14} />;
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    return status === 'active' ? 
      <CheckCircle size={14} className="text-green-500" /> : 
      <XCircle size={14} className="text-red-500" />;
  };

  // Get role description
  const getRoleDescription = (role) => {
    switch (role) {
      case 'admin': return 'Full access to all features and settings';
      case 'editor': return 'Can create, edit, and delete content';
      case 'viewer': return 'Can only view content, no editing rights';
      default: return 'Limited access';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format datetime
  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (fullName) =>{
    return fullName.trim().split(/\s+/).map(word=>word[0].toUpperCase()).join('');
  }

  // Roles for dropdown
  const roles = [
    { value: 'admin', label: 'Administrator', icon: ShieldCheck },
    { value: 'editor', label: 'Editor', icon: Edit2 },
    { value: 'viewer', label: 'Viewer', icon: Eye },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all">
            <Plus size={18} className="mr-2" />
            Invite User
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <UserIcon size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Administrators</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <Shield size={20} className="text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Selected</p>
              <p className="text-2xl font-bold text-gray-900">{selectedUsers.length}</p>
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
              placeholder="Search users by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="admin">Administrator</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
            
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            {selectedUsers.length > 0 && (
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

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
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
                    <p className="mt-2 text-gray-500">Loading users...</p>
                  </td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <UserIcon size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">No users found</p>
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white font-medium ${
                          user.role === 'admin' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                          user.role === 'editor' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                          'bg-gradient-to-r from-green-500 to-emerald-500'
                        }`}>
                          {getInitials(user.name)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail size={12} className="mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          <span className="mr-1.5">{getRoleIcon(user.role)}</span>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        {getStatusIcon(user.status)}
                        <span className={`ml-2 text-sm ${user.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar size={14} className="text-gray-400 mr-2" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-500">
                        {formatDateTime(user.lastLogin)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openViewModal(user)}
                          className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <MoreVertical size={16} />
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
                {Math.min(indexOfLastItem, filteredUsers.length)}
              </span>{' '}
              of <span className="font-medium">{filteredUsers.length}</span> results
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

      {/* Role Permissions Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div key={role.value} className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-center mb-3">
                <div className={`p-2 rounded-lg mr-3 ${
                  role.value === 'admin' ? 'bg-red-50' :
                  role.value === 'editor' ? 'bg-blue-50' : 'bg-green-50'
                }`}>
                  <role.icon size={20} className={
                    role.value === 'admin' ? 'text-red-600' :
                    role.value === 'editor' ? 'text-blue-600' : 'text-green-600'
                  } />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{role.label}</h4>
                  <p className="text-sm text-gray-500">
                    {users.filter(u => u.role === role.value).length} users
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {getRoleDescription(role.value)}
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <CheckCircle size={14} className="text-green-500 mr-2" />
                  <span className={role.value === 'admin' ? 'font-medium' : 'text-gray-500'}>
                    Full system access
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  {role.value === 'admin' || role.value === 'editor' ? (
                    <CheckCircle size={14} className="text-green-500 mr-2" />
                  ) : (
                    <XCircle size={14} className="text-gray-300 mr-2" />
                  )}
                  <span className={role.value === 'admin' || role.value === 'editor' ? 'font-medium' : 'text-gray-500'}>
                    Create & edit content
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  {role.value === 'admin' ? (
                    <CheckCircle size={14} className="text-green-500 mr-2" />
                  ) : (
                    <XCircle size={14} className="text-gray-300 mr-2" />
                  )}
                  <span className={role.value === 'admin' ? 'font-medium' : 'text-gray-500'}>
                    Manage users
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle size={14} className="text-green-500 mr-2" />
                  <span className="font-medium">View content</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className={`flex-shrink-0 h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-medium ${
                  selectedUser.role === 'admin' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                  selectedUser.role === 'editor' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                  'bg-gradient-to-r from-green-500 to-emerald-500'
                }`}>
                  {getInitials(selectedUser.name)}
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-bold text-gray-900">{selectedUser.name}</h4>
                  <p className="text-gray-600">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Role
                    </label>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getRoleBadgeColor(selectedUser.role)}`}>
                        <span className="mr-2">{getRoleIcon(selectedUser.role)}</span>
                        {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Status
                    </label>
                    <div className="flex items-center">
                      {getStatusIcon(selectedUser.status)}
                      <span className={`ml-2 ${selectedUser.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Contact Information
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail size={16} className="text-gray-400 mr-3" />
                      <span className="text-gray-900">{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone size={16} className="text-gray-400 mr-3" />
                      <span className="text-gray-900">{selectedUser.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Join Date
                    </label>
                    <div className="flex items-center">
                      <Calendar size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-900">{formatDate(selectedUser.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Last Login
                    </label>
                    <div className="flex items-center">
                      <Clock size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-900">{formatDateTime(selectedUser.lastLogin)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Permissions
                  </label>
                  <p className="text-sm text-gray-600">
                    {getRoleDescription(selectedUser.role)}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowViewModal(false);
                    openEditModal(selectedUser);
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700"
                >
                  Edit User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              <div className="flex items-center mb-6">
                <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center text-white font-medium ${
                  editForm.role === 'admin' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                  editForm.role === 'editor' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                  'bg-gradient-to-r from-green-500 to-emerald-500'
                }`}>
                  {getInitials(selectedUser.name)}
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">{selectedUser.name}</h4>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Role *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {roles.map((role) => (
                    <label
                      key={role.value}
                      className={`
                        relative flex items-center p-4 border rounded-lg cursor-pointer transition-all
                        ${editForm.role === role.value
                          ? role.value === 'admin' ? 'border-red-300 bg-red-50' :
                            role.value === 'editor' ? 'border-blue-300 bg-blue-50' :
                            'border-green-300 bg-green-50'
                          : 'border-gray-200 hover:bg-gray-50'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        checked={editForm.role === role.value}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                        className="sr-only"
                      />
                      <div className={`p-2 rounded-lg mr-3 ${
                        editForm.role === role.value
                          ? role.value === 'admin' ? 'bg-red-100' :
                            role.value === 'editor' ? 'bg-blue-100' :
                            'bg-green-100'
                          : 'bg-gray-100'
                      }`}>
                        <role.icon size={18} className={
                          editForm.role === role.value
                            ? role.value === 'admin' ? 'text-red-600' :
                              role.value === 'editor' ? 'text-blue-600' :
                              'text-green-600'
                            : 'text-gray-400'
                        } />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{role.label}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {getRoleDescription(role.value)}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Status
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={editForm.isActive}
                      onChange={() => setEditForm({ ...editForm, isActive: true })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="ml-2">
                      <div className="flex items-center">
                        <CheckCircle size={16} className="text-green-500 mr-2" />
                        <span className="text-gray-700">Active</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">User can access the system</div>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!editForm.isActive}
                      onChange={() => setEditForm({ ...editForm, isActive: false })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="ml-2">
                      <div className="flex items-center">
                        <XCircle size={16} className="text-red-500 mr-2" />
                        <span className="text-gray-700">Inactive</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">User access is blocked</div>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Permissions Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    {editForm.role === 'admin' ? (
                      <CheckCircle size={14} className="text-green-500 mr-2" />
                    ) : (
                      <XCircle size={14} className="text-gray-300 mr-2" />
                    )}
                    <span className={editForm.role === 'admin' ? 'text-gray-900' : 'text-gray-500'}>
                      Full system administration
                    </span>
                  </div>
                  <div className="flex items-center">
                    {editForm.role === 'admin' || editForm.role === 'editor' ? (
                      <CheckCircle size={14} className="text-green-500 mr-2" />
                    ) : (
                      <XCircle size={14} className="text-gray-300 mr-2" />
                    )}
                    <span className={editForm.role === 'admin' || editForm.role === 'editor' ? 'text-gray-900' : 'text-gray-500'}>
                      Create and edit content
                    </span>
                  </div>
                  <div className="flex items-center">
                    {editForm.role === 'admin' ? (
                      <CheckCircle size={14} className="text-green-500 mr-2" />
                    ) : (
                      <XCircle size={14} className="text-gray-300 mr-2" />
                    )}
                    <span className={editForm.role === 'admin' ? 'text-gray-900' : 'text-gray-500'}>
                      Manage other users
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle size={14} className="text-green-500 mr-2" />
                    <span className="text-gray-900">View all content</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6">
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
                  {loading ? 'Updating...' : 'Update User'}
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
                <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
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
                Are you sure you want to delete this user account? This action cannot be undone.
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
                  onClick={handleDeleteUser}
                  disabled={loading}
                  className="px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-70"
                >
                  {loading ? 'Deleting...' : 'Delete User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;