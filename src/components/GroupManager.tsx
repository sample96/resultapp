import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';

interface Group {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  memberCount: number;
  totalPoints: number;
  achievements: Array<{
    eventName: string;
    position: string;
    points: number;
    date: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const GroupManager: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    totalPoints: 0
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await api.get('/groups');
      setGroups(response.data);
    } catch (error) {
      toast.error('Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Please fill in the group name');
      return;
    }

    try {
      if (editingGroup) {
        await api.put(`/groups/${editingGroup._id}`, formData);
        toast.success('Group updated successfully!');
      } else {
        await api.post('/groups', formData);
        toast.success('Group created successfully!');
      }
      
      setShowForm(false);
      setEditingGroup(null);
      resetForm();
      fetchGroups();
    } catch (error) {
      toast.error('Failed to save group');
    }
  };

  const handleDelete = async (groupId: string) => {
    if (!window.confirm('Are you sure you want to delete this group?')) {
      return;
    }

    try {
      await api.delete(`/groups/${groupId}`);
      toast.success('Group deleted successfully!');
      fetchGroups();
    } catch (error) {
      toast.error('Failed to delete group');
    }
  };

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      description: group.description || '',
      totalPoints: group.totalPoints
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      totalPoints: 0
    });
  };

  const getFilteredGroups = () => {
    let filtered = groups.filter(group => group.isActive);

    if (searchTerm) {
      filtered = filtered.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredGroups = getFilteredGroups();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Group Management</h2>
          <p className="text-gray-600">Create and manage groups for competitions</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingGroup(null);
            resetForm();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          Add Group
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Groups List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Groups Found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'No groups available yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <div key={group._id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{group.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{group.description || 'No description'}</p>

                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(group)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(group._id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Members:</span>
                  <span className="font-medium">{group.memberCount}</span>
                </div>
               
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Achievements:</span>
                  <span className="font-medium">{group.achievements.length}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  Created: {new Date(group.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingGroup ? 'Edit Group' : 'Add New Group'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingGroup(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter group name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter group description"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingGroup(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  {editingGroup ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupManager;
