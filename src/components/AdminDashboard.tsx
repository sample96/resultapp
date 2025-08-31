import React, { useState } from 'react';
import { Plus, Settings, Users, FileText, BarChart3, Shield, Grid, List, Search } from 'lucide-react';
import ResultForm from './ResultForm';
import CategoryManager from './CategoryManager';

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'add-result' | 'categories'>('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showForm, setShowForm] = useState(false);

  const handleResultCreated = () => {
    setShowForm(false);
  };

  const stats = [
    { label: 'Total Results', value: '24', icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Categories', value: '8', icon: Settings, color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Mawlid Events', value: '12', icon: BarChart3, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { label: 'Participants', value: '156', icon: Users, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  ];

  const recentActivities = [
    {
      type: 'result',
      title: 'New result added',
      description: 'Mawlid Nabi 2024 - Individual Category',
      time: '2 hours ago',
      icon: Plus,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      type: 'category',
      title: 'Category updated',
      description: 'Islamic Studies category modified',
      time: '1 day ago',
      icon: Settings,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      type: 'user',
      title: 'User activity',
      description: '25 Mawlid certificates downloaded today',
      time: '3 hours ago',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-100/50 shadow-sm sticky top-0 z-40">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.png" 
                  alt="ResultApp Logo" 
                  className="w-12 h-12 rounded-xl shadow-sm bg-black p-1"
                />
                <div className="p-3 bg-red-100 rounded-xl">
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Manage Mawlid results, categories, and system settings</p>
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-gray-100/50 rounded-xl p-1">
            <button
              onClick={() => setActiveSection('overview')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                activeSection === 'overview'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection('add-result')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                activeSection === 'add-result'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Add Result
            </button>
            <button
              onClick={() => setActiveSection('categories')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                activeSection === 'categories'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Categories
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeSection === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'} gap-4`}>
              {stats.map((stat, index) => (
                <div key={index} className={`${stat.bgColor} rounded-2xl p-6 hover:shadow-md transition-all duration-200`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Recent Activity</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search activities..."
                    className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className={`space-y-4 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : ''}`}>
                {recentActivities.map((activity, index) => (
                  <div key={index} className={`${activity.bgColor} rounded-xl p-4 hover:shadow-md transition-all duration-200`}>
                    <div className="flex items-start gap-4">
                      <div className={`p-2 ${activity.bgColor} rounded-lg`}>
                        <activity.icon className={`w-5 h-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{activity.title}</div>
                        <div className="text-sm text-gray-600 mb-2">{activity.description}</div>
                        <div className="text-xs text-gray-500">{activity.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveSection('add-result')}
                  className="flex items-center gap-4 p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors duration-200"
                >
                  <Plus className="w-6 h-6 text-red-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Add New Result</div>
                    <div className="text-sm text-gray-600">Create a new Mawlid event result</div>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveSection('categories')}
                  className="flex items-center gap-4 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200"
                >
                  <Settings className="w-6 h-6 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Manage Categories</div>
                    <div className="text-sm text-gray-600">Add or edit categories</div>
                  </div>
                </button>
                
                <button className="flex items-center gap-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200">
                  <Users className="w-6 h-6 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">View Analytics</div>
                    <div className="text-sm text-gray-600">Check system statistics</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'add-result' && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-6">
            <div className="flex items-center mb-6">
              <Plus className="w-8 h-8 text-red-600 mr-4" />
              <h2 className="text-2xl font-semibold text-gray-900">Add New Result</h2>
            </div>
            <ResultForm onSuccess={handleResultCreated} />
          </div>
        )}

        {activeSection === 'categories' && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-6">
            <CategoryManager />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
