import React, { useState, useEffect, useRef } from 'react';
import { Download, Edit2, Trash2, Calendar, Award, User, Eye, X } from 'lucide-react';
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

const IndividualResultList: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [editResult, setEditResult] = useState<Result | null>(null);
  const [certificateResult, setCertificateResult] = useState<ResultType | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const certificateRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await api.get('/results');
      setResults(response.data.filter((r: Result) => r.individual && (
        r.individual.first?.name || r.individual.second?.name || r.individual.third?.name
      )));
    } catch (error) {
      toast.error('Failed to fetch results');
    } finally {
      setLoading(false);
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

  const handleEditSuccess = () => {
    closeEditModal();
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
        link.download = `${certificateResult.eventName}_certificate.png`;
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

  const getRankColor = (rank: number) => {
    const colors = ['text-amber-500', 'text-gray-600', 'text-orange-500'];
    return colors[rank] || 'text-gray-600';
  };

  const getRankBg = (rank: number) => {
    const colors = ['bg-amber-50/50', 'bg-gray-50/50', 'bg-orange-50/50'];
    return colors[rank] || 'bg-gray-50/50';
  };

  const ResultCard = ({ result }: { result: Result }) => (
    <div className="group bg-white/80 rounded-2xl shadow-sm border border-gray-100/50 hover:shadow-xl hover:border-blue-200/50 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden backdrop-blur-sm w-full max-w-md lg:max-w-lg mx-auto">
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                {result.eventName}
              </h3>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-blue-100/80 text-blue-800 backdrop-blur-sm">
                  {result.category?.name || 'Unknown'}
                </span>
                <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  {new Date(result.eventDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowPreview(result._id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-gray-100/50 rounded-lg"
            >
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-800">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              Individual Results
            </div>
            
            <div className="space-y-2">
              {['first', 'second', 'third'].map((place, idx) => {
                const pos = result.individual && result.individual[place as keyof typeof result.individual];
                return pos && pos.name ? (
                  <div key={place} className={`flex items-center gap-3 p-3 sm:p-4 rounded-lg ${getRankBg(idx)} hover:bg-opacity-80 transition-all duration-200`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xl sm:text-2xl">{["🥇", "🥈", "🥉"][idx]}</span>
                      <span className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                        {place}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold ${getRankColor(idx)} text-sm sm:text-base truncate`}>
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

          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-100/50">
            <button
              onClick={() => openEditModal(result._id)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm sm:text-base font-medium text-blue-600 bg-blue-50/50 hover:bg-blue-100/50 rounded-lg transition-all duration-200"
            >
              <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
              Edit
            </button>
            <button
              onClick={() => handleDownloadCertificate(result)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm sm:text-base font-medium text-green-600 bg-green-50/50 hover:bg-green-100/50 rounded-lg transition-all duration-200"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              Certificate
            </button>
            <button
              onClick={() => deleteResult(result._id)}
              className="inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-50/50 rounded-lg transition-all duration-200"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ResultPreview = ({ result }: { result: Result }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-gray-100/50 sticky top-0 bg-white/95 backdrop-blur-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Event Details</h2>
          <button
            onClick={() => setShowPreview(null)}
            className="p-2 hover:bg-gray-100/50 rounded-full transition-all duration-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">{result.eventName}</h3>
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
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Individual Event Results</h1>
        <p className="text-blue-100 text-sm sm:text-base">Manage and view all your individual event results</p>
      </div>

      {/* Cards for mobile */}
      <div className="block sm:hidden space-y-4">
        {results.map((result) => (
          <ResultCard key={result._id} result={result} />
        ))}
      </div>

      {/* Table for tablet/desktop */}
      <div className="hidden sm:block overflow-x-auto w-full">
        <table className="min-w-full bg-white/80 rounded-2xl shadow-sm border border-gray-100/50 backdrop-blur-sm text-sm">
          <thead className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 text-gray-800 sticky top-0 z-10">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left font-semibold whitespace-nowrap">Event Name</th>
              <th className="px-4 sm:px-6 py-3 text-left font-semibold whitespace-nowrap">Category</th>
              <th className="px-4 sm:px-6 py-3 text-left font-semibold whitespace-nowrap">Date</th>
              <th className="px-4 sm:px-6 py-3 text-left font-semibold whitespace-nowrap">Individual Results</th>
              <th className="px-4 sm:px-6 py-3 text-center font-semibold whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result._id} className="border-b border-gray-100/50 last:border-b-0 hover:bg-blue-50/50 transition-all duration-200">
                <td className="px-4 sm:px-6 py-3 font-semibold text-gray-900">{result.eventName}</td>
                <td className="px-4 sm:px-6 py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-blue-100/80 text-blue-800 backdrop-blur-sm">
                    {result.category?.name || 'Unknown'}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-3 whitespace-nowrap">{new Date(result.eventDate).toLocaleDateString()}</td>
                <td className="px-4 sm:px-6 py-3">
                  <div className="space-y-1">
                    {['first', 'second', 'third'].map((place, idx) => {
                      const pos = result.individual && result.individual[place as keyof typeof result.individual];
                      return pos && pos.name ? (
                        <div key={place} className={`flex items-center gap-2 p-2 rounded-lg ${getRankBg(idx)}`}>
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
                <td className="px-4 sm:px-6 py-3">
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

      {/* Empty State */}
      {results.length === 0 && !loading && (
        <div className="text-center py-20 bg-white/80 rounded-2xl shadow-sm border border-gray-100/50 backdrop-blur-sm">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100/50 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Individual Results Found</h3>
          <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
            Create your first individual event result to get started!
          </p>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <ResultPreview result={results.find(r => r._id === showPreview)!} />
      )}

      {/* Edit Modal */}
      {editResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 relative">
            <button 
              onClick={closeEditModal} 
              className="absolute top-4 right-4 p-2 hover:bg-gray-100/50 rounded-full transition-all duration-200 z-10"
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

      {/* Certificate Modal */}
      {certificateResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 relative">
            <button 
              onClick={handleCloseCertificate} 
              className="absolute top-4 right-4 p-2 hover:bg-gray-100/50 rounded-full transition-all duration-200 z-10"
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
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {downloading ? 'Downloading...' : 'Download as Image'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndividualResultList;