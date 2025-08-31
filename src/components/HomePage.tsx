import React, { useState, useEffect } from 'react';
import { Download, Calendar, Award, User, Users, Search, Filter, Eye, X, Monitor, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import html2canvas from 'html2canvas';
import Certificate from './Certificate';
import TVResultsDisplay from './TVResultsDisplay';
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
  eventName: string;
  eventDate: string;
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

type TabType = 'individual' | 'group';
type ViewMode = 'mobile' | 'tv';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('individual');
  const [viewMode, setViewMode] = useState<ViewMode>('mobile');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [certificateResult, setCertificateResult] = useState<ResultType | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await api.get('/results');
      setResults(response.data);
    } catch (error) {
      toast.error('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredResults = () => {
    let filtered = results.filter((r: Result) => {
      if (activeTab === 'individual') {
        return r.individual && (
          r.individual.first?.name || r.individual.second?.name || r.individual.third?.name
        );
      } else {
        return r.group && (
          r.group.first?.name || r.group.second?.name || r.group.third?.name
        );
      }
    });

    if (searchTerm) {
      filtered = filtered.filter(result =>
        result.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(result => result.category._id === selectedCategory);
    }

    return filtered;
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

  const downloadCertificate = async () => {
    if (!certificateResult) return;

    setDownloading(true);
    try {
      const element = document.getElementById('certificate-preview');
      if (!element) {
        toast.error('Certificate preview not found');
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${certificateResult.eventName}_${certificateResult.category.name}_certificate.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Certificate downloaded successfully!');
      setCertificateResult(null);
    } catch (error) {
      toast.error('Failed to download certificate');
    } finally {
      setDownloading(false);
    }
  };

  const filteredResults = getFilteredResults();

  // TV Display Mode
  if (viewMode === 'tv') {
    return <TVResultsDisplay />;
  }

  // Mobile App Mode
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Mobile App Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100/50 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Mawlid Results</h1>
            {/* <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'
                }`}
              >
                <Smartphone className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('tv')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'tv' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'
                }`}
              >
                <Monitor className="w-5 h-5" />
              </button>
            </div> */}
          </div>
          
         
          <div className="flex bg-gray-100/50 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('individual')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'individual'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Individual</span>
            </button>
            <button
              onClick={() => setActiveTab('group')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'group'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Group</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Mawlid events or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-8 text-center">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : `No ${activeTab} Mawlid results available yet.`}
            </p>
          </div>
        ) : (
          filteredResults.map((result) => (
            <div
              key={result._id}
              className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {result.eventName}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(result.eventDate).toLocaleDateString()}
                    </div>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      {result.category.name}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDownloadCertificate(result)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>

              {/* Results Display */}
              <div className="space-y-3">
                {activeTab === 'individual' && result.individual && (
                  <div className="grid grid-cols-1 gap-3">
                    {result.individual.first && (
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-4 text-white">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">🥇</div>
                          <div>
                            <div className="font-semibold text-lg">1st Place</div>
                            <div className="text-sm">{result.individual.first.name}</div>
                          </div>
                        </div>
                      </div>
                    )}
                    {result.individual.second && (
                      <div className="bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl p-4 text-white">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">🥈</div>
                          <div>
                            <div className="font-semibold text-lg">2nd Place</div>
                            <div className="text-sm">{result.individual.second.name}</div>
                          </div>
                        </div>
                      </div>
                    )}
                    {result.individual.third && (
                      <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl p-4 text-white">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">🥉</div>
                          <div>
                            <div className="font-semibold text-lg">3rd Place</div>
                            <div className="text-sm">{result.individual.third.name}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'group' && result.group && (
                  <div className="grid grid-cols-1 gap-3">
                    {result.group.first && (
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-4 text-white">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">🥇</div>
                          <div>
                            <div className="font-semibold text-lg">1st Place</div>
                            <div className="text-sm">{result.group.first.name}</div>
                          </div>
                        </div>
                      </div>
                    )}
                    {result.group.second && (
                      <div className="bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl p-4 text-white">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">🥈</div>
                          <div>
                            <div className="font-semibold text-lg">2nd Place</div>
                            <div className="text-sm">{result.group.second.name}</div>
                          </div>
                        </div>
                      </div>
                    )}
                    {result.group.third && (
                      <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl p-4 text-white">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">🥉</div>
                          <div>
                            <div className="font-semibold text-lg">3rd Place</div>
                            <div className="text-sm">{result.group.third.name}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Certificate Preview Modal */}
      {certificateResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Certificate Preview</h2>
              <button
                onClick={() => setCertificateResult(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div id="certificate-preview">
                <Certificate result={certificateResult} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setCertificateResult(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={downloadCertificate}
                disabled={downloading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {downloading ? 'Downloading...' : 'Download Certificate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
