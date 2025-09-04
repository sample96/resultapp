import React, { useState, useEffect, useRef } from 'react';
import { Download, Edit2, Trash2, Calendar, Award, User, Eye, X, Search, Filter, SortAsc, Plus, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import ResultForm from './ResultForm';
import html2canvas from 'html2canvas';
import Certificate from './Certificate';
import type { Result as ResultType } from '../types';

interface Category {
  _id: string;
  name: string;
}

interface Position {
  name: string;
  details: string;
}

interface Result {
  _id: string;
  category: Category;
  eventName?: string;
  eventDate?: string;
  individual: {
    first: Position;
    second: Position;
    third: Position;
  } | null;
  group: {
    first: Position;
    second: Position;
    third: Position;
  } | null;
  createdAt: string;
  updatedAt: Date;
}

const IndividualResultList: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [editResult, setEditResult] = useState<Result | null>(null);
  const [addResult, setAddResult] = useState<boolean>(false);
  const [certificateResult, setCertificateResult] = useState<ResultType | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const certificateRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setRefreshing(true);
      const response = await api.get('/results');
      setResults(response.data.filter((r: Result) => r.individual && (
        r.individual.first?.name || r.individual.second?.name || r.individual.third?.name
      )));
    } catch (error) {
      toast.error('Failed to fetch results');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const deleteResult = async (resultId: string) => {
    if (!window.confirm('Are you sure you want to delete this result?')) {
      return;
    }
    try {
      await api.delete(`/results/${resultId}`);
      setResults(prev => prev.filter(result => result._id !== resultId));
      toast.success('Result deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete result');
    }
  };

  const openEditModal = (id: string) => {
    const found = results.find(r => r._id === id);
    if (found) setEditResult(found);
  };

  const closeEditModal = () => setEditResult(null);

  const openAddModal = () => setAddResult(true);

  const closeAddModal = () => setAddResult(false);

  const handleEditSuccess = () => {
    closeEditModal();
    fetchResults();
  };

  const handleAddSuccess = () => {
    closeAddModal();
    fetchResults();
  };

  const handleDownloadCertificate = async (result: Result) => {
    const safeCategory = {
      ...result.category,
      createdAt: (result.category as any).createdAt || '',
      updatedAt: (result.category as any).updatedAt || '',
    };
    setCertificateResult({
      ...result,
      category: safeCategory,
      createdAt: (result as any).createdAt || '',
      updatedAt: (result as any).updatedAt || '',
    } as ResultType);
  };

  const handleCloseCertificate = () => {
    setCertificateResult(null);
  };

  const handleExportImage = async () => {
    if (!certificateResult) {
      console.error('No certificate result available');
      return;
    }
    setDownloading(true);
    try {
      const certElement = certificateRef.current;
      if (!certElement) {
        toast.error('Certificate element not found');
        return;
      }
      certElement.scrollIntoView({ behavior: 'auto', block: 'center' });
      await new Promise(res => setTimeout(res, 500));
      const rect = certElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        toast.error('Certificate element not properly rendered');
        return;
      }
      const canvas = await html2canvas(certElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        height: rect.height,
        width: rect.width,
        scrollX: 0,
        scrollY: 0,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      });
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error('Failed to create image file');
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${certificateResult.eventName || 'Competition'}_certificate.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('Certificate image downloaded!');
      }, 'image/png', 1.0);
    } catch (error) {
      toast.error('Failed to download image. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const filteredResults = results
    .filter(result => {
      const matchesSearch = result.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           result.category.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || result.category.name === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
      if (sortBy === 'name') return (a.eventName || '').localeCompare(b.eventName || '');
      return 0;
    });

  const categories = ['all', ...Array.from(new Set(results.map(r => r.category.name)))];

  const getRankColor = (rank: number) => {
    const colors = ['text-amber-500', 'text-gray-600', 'text-orange-500'];
    return colors[rank] || 'text-gray-600';
  };

  const getRankBg = (rank: number) => {
    const colors = ['bg-amber-50/50', 'bg-gray-50/50', 'bg-orange-50/50'];
    return colors[rank] || 'bg-gray-50/50';
  };

  const getRankBorder = (rank: number) => {
    const colors = ['border-amber-200/50', 'border-gray-200/50', 'border-orange-200/50'];
    return colors[rank] || 'border-gray-200/50';
  };

  // Mobile Card Component
  const MobileResultCard = ({ result }: { result: Result }) => (
    <div className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 hover:shadow-xl hover:border-blue-200/50 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden animate-fade-in-up">
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                {result.eventName}
              </h3>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100/80 text-blue-800 backdrop-blur-sm">
                  {result.category?.name || 'Unknown'}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {new Date(result.eventDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowPreview(result._id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-gray-100/50 rounded-lg touch-target"
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Results Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <User className="w-4 h-4 text-blue-500" />
              Individual Results
            </div>
            
            <div className="space-y-2">
              {['first', 'second', 'third'].map((place, idx) => {
                const pos = result.individual && result.individual[place as keyof typeof result.individual];
                return pos && pos.name ? (
                  <div key={place} className={`flex items-center gap-3 p-3 rounded-lg ${getRankBg(idx)} ${getRankBorder(idx)} border hover:bg-opacity-80 transition-all duration-200`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{["🥇", "🥈", "🥉"][idx]}</span>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {place}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold ${getRankColor(idx)} text-sm truncate`}>
                        {pos.name}
                      </div>
                      {pos.details && (
                        <div className="text-xs text-gray-500 truncate">
                          {pos.details}
                        </div>
                      )}
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-100/50">
            <button
              onClick={() => openEditModal(result._id)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50/50 hover:bg-blue-100/50 rounded-lg transition-all duration-200 touch-target"
            >
              <Edit2 className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={() => handleDownloadCertificate(result)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-green-600 bg-green-50/50 hover:bg-green-100/50 rounded-lg transition-all duration-200 touch-target"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Certificate</span>
            </button>
            <button
              onClick={() => deleteResult(result._id)}
              className="inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-50/50 rounded-lg transition-all duration-200 touch-target"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop Card Component
  const DesktopResultCard = ({ result }: { result: Result }) => (
    <div className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 hover:shadow-xl hover:border-blue-200/50 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden animate-fade-in-up">
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                {result.eventName || 'Competition'}
              </h3>
              <div className="flex items-center gap-3 mt-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100/80 text-blue-800 backdrop-blur-sm">
                  {result.category?.name || 'Unknown'}
                </span>
                <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {new Date(result.eventDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowPreview(result._id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-gray-100/50 rounded-lg"
            >
              <Eye className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-base font-semibold text-gray-800">
              <User className="w-5 h-5 text-blue-500" />
              Individual Results
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {['first', 'second', 'third'].map((place, idx) => {
                const pos = result.individual && result.individual[place as keyof typeof result.individual];
                return pos && pos.name ? (
                  <div key={place} className={`flex items-center gap-4 p-4 rounded-xl ${getRankBg(idx)} ${getRankBorder(idx)} border hover:bg-opacity-80 transition-all duration-200`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{["🥇", "🥈", "🥉"][idx]}</span>
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                        {place}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold ${getRankColor(idx)} text-base`}>
                        {pos.name}
                      </div>
                      {pos.details && (
                        <div className="text-sm text-gray-500 mt-1">
                          {pos.details}
                        </div>
                      )}
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100/50">
            <button
              onClick={() => openEditModal(result._id)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-600 bg-blue-50/50 hover:bg-blue-100/50 rounded-lg transition-all duration-200"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => handleDownloadCertificate(result)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-green-600 bg-green-50/50 hover:bg-green-100/50 rounded-lg transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              Certificate
            </button>
            <button
              onClick={() => deleteResult(result._id)}
              className="inline-flex items-center justify-center p-2.5 text-red-600 hover:bg-red-50/50 rounded-lg transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop Table Component
  const DesktopTable = () => (
    <div className="hidden lg:block overflow-x-auto w-full">
      <table className="min-w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 text-sm">
        <thead className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 text-gray-800 sticky top-0 z-10">
          <tr>
            <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">Event Name</th>
            <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">Category</th>
            <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">Date</th>
            <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">Individual Results</th>
            <th className="px-6 py-4 text-center font-semibold whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredResults.map((result, index) => (
            <tr key={result._id} className={`border-b border-gray-100/50 last:border-b-0 hover:bg-blue-50/50 transition-all duration-200 animate-fade-in-up`} style={{ animationDelay: `${index * 0.1}s` }}>
                              <td className="px-6 py-4 font-semibold text-gray-900">{result.eventName || 'Competition'}</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100/80 text-blue-800 backdrop-blur-sm">
                  {result.category?.name || 'Unknown'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(result.eventDate).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                <div className="space-y-2">
                  {['first', 'second', 'third'].map((place, idx) => {
                    const pos = result.individual && result.individual[place as keyof typeof result.individual];
                    return pos && pos.name ? (
                      <div key={place} className={`flex items-center gap-3 p-3 rounded-lg ${getRankBg(idx)} ${getRankBorder(idx)} border`}>
                        <span className="text-lg">{["🥇", "🥈", "🥉"][idx]}</span>
                        <div className="flex-1">
                          <div className={`font-semibold ${getRankColor(idx)} text-sm`}>{pos.name}</div>
                          {pos.details && <div className="text-xs text-gray-500">{pos.details}</div>}
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setShowPreview(result._id)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50/50 hover:bg-gray-100/50 rounded-lg transition-all duration-200"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => openEditModal(result._id)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50/50 hover:bg-blue-100/50 rounded-lg transition-all duration-200"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDownloadCertificate(result)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50/50 hover:bg-green-100/50 rounded-lg transition-all duration-200"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Certificate
                  </button>
                  <button
                    onClick={() => deleteResult(result._id)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50/50 hover:bg-red-100/50 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Result Preview Modal
  const ResultPreview = ({ result }: { result: Result }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 animate-scale-in">
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-gray-100/50 sticky top-0 bg-white/95 backdrop-blur-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Event Details</h2>
          <button
            onClick={() => setShowPreview(null)}
            className="p-2 hover:bg-gray-100/50 rounded-full transition-all duration-200 touch-target"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900">{result.eventName || 'Competition'}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span className="text-sm sm:text-base text-gray-600">Category: {result.category?.name || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span className="text-sm sm:text-base text-gray-600">Date: {new Date(result.eventDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl p-5 sm:p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-base sm:text-lg">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                Individual Results
              </h4>
              <div className="space-y-3">
                {['first', 'second', 'third'].map((place, idx) => {
                  const pos = result.individual && result.individual[place as keyof typeof result.individual];
                  return pos && pos.name ? (
                    <div key={place} className="flex items-center gap-3 p-3 bg-white/80 rounded-lg shadow-sm hover:bg-white transition-all duration-200">
                      <span className="text-xl sm:text-2xl">{["🥇", "🥈", "🥉"][idx]}</span>
                      <div className="flex-1">
                        <div className={`font-semibold ${getRankColor(idx)} text-sm sm:text-base`}>
                          {pos.name}
                        </div>
                        {pos.details && (
                          <div className="text-xs sm:text-sm text-gray-500">
                            {pos.details}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-4 text-gray-600 font-medium text-sm sm:text-base">Loading results...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Individual Mawlid Results</h1>
            <p className="text-blue-100 text-sm sm:text-base">Manage and view all your individual Mawlid event results</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 touch-target"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Result</span>
            </button>
            <button
              onClick={fetchResults}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 touch-target"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-white/20 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'grid' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/20'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'list' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/20'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-4 sm:p-6 animate-fade-in-up">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Mawlid events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-between sm:justify-start gap-2 px-4 py-3 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </div>
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {showFilters && (
              <div className="flex flex-col sm:flex-row gap-3 sm:ml-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                >
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Count */}
      {filteredResults.length > 0 && (
        <div className="flex items-center justify-between bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100/50 p-4 animate-fade-in-up">
          <p className="text-sm sm:text-base text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredResults.length}</span> of <span className="font-semibold text-gray-900">{results.length}</span> results
          </p>
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <div className="space-y-0.5 w-4 h-4">
                <div className="bg-current rounded-sm h-0.5"></div>
                <div className="bg-current rounded-sm h-0.5"></div>
                <div className="bg-current rounded-sm h-0.5"></div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {filteredResults.length === 0 ? (
        <div className="text-center py-20 bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 animate-fade-in-up">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100/50 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Individual Mawlid Results Found</h3>
          <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto mb-6">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first individual Mawlid event result to get started!'
            }
          </p>
          {!searchTerm && selectedCategory === 'all' && (
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 touch-target"
            >
              <Plus className="w-5 h-5" />
              Add Your First Result
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Mobile Grid View */}
          <div className="block lg:hidden">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {filteredResults.map((result, index) => (
                  <MobileResultCard key={result._id} result={result} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredResults.map((result, index) => (
                  <MobileResultCard key={result._id} result={result} />
                ))}
              </div>
            )}
          </div>

          {/* Desktop View */}
          <div className="hidden lg:block">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                {filteredResults.map((result, index) => (
                  <DesktopResultCard key={result._id} result={result} />
                ))}
              </div>
            ) : (
              <DesktopTable />
            )}
          </div>
        </>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <ResultPreview result={filteredResults.find(r => r._id === showPreview)!} />
      )}

      {/* Edit Modal */}
      {editResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 relative animate-scale-in">
            <button 
              onClick={closeEditModal} 
              className="absolute top-4 right-4 p-2 hover:bg-gray-100/50 rounded-full transition-all duration-200 z-10 touch-target"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <div className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Edit Result</h2>
              <ResultForm 
                result={editResult} 
                onSuccess={handleEditSuccess} 
                onCancel={closeEditModal} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {addResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 relative animate-scale-in">
            <button 
              onClick={closeAddModal} 
              className="absolute top-4 right-4 p-2 hover:bg-gray-100/50 rounded-full transition-all duration-200 z-10 touch-target"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <div className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Add New Individual Result</h2>
              <ResultForm 
                onSuccess={handleAddSuccess} 
                onCancel={closeAddModal}
                forcedResultType="individual"
              />
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {certificateResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 relative animate-scale-in">
            <button 
              onClick={handleCloseCertificate} 
              className="absolute top-4 right-4 p-2 hover:bg-gray-100/50 rounded-full transition-all duration-200 z-10 touch-target"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <div className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-center">Certificate</h2>
              <div ref={certificateRef} className="w-full mb-6">
                <Certificate result={certificateResult} id="certificate-individual" />
              </div>
              <button
                onClick={handleExportImage}
                disabled={downloading}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 touch-target"
              >
                {downloading ? 'Downloading...' : 'Download as Image'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button for Mobile */}
      <button
        onClick={openAddModal}
        className="fixed bottom-6 right-6 z-40 lg:hidden w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center touch-target"
        aria-label="Add new result"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default IndividualResultList;