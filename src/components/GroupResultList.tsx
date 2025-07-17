import React, { useState, useEffect, useRef } from 'react';
import { Download, Edit2, Trash2 } from 'lucide-react';
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

const GroupResultList: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [editResult, setEditResult] = useState<Result | null>(null);
  const [certificateResult, setCertificateResult] = useState<ResultType | null>(null);
  const [downloading, setDownloading] = useState(false);
  const certificateRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await api.get('/results');
      // Only results with group data
      setResults(response.data.filter((r: Result) => r.group && (
        r.group.first?.name || r.group.second?.name || r.group.third?.name
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-semibold text-gray-500 mb-1">No Group Results Yet</h3>
        <p className="text-gray-400 text-sm">Create your first group event result to get started!</p>
      </div>
    );
  }

  return (
    <>
      {/* Cards for mobile */}
      <div className="block sm:hidden space-y-4">
        {results.map((result) => (
          <div key={result._id} className="bg-white rounded-lg shadow border border-gray-100 p-4 flex flex-col gap-2 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-base font-bold text-gray-900">{result.eventName}</div>
                <div className="text-xs text-blue-600 font-medium">{result.category?.name || 'Unknown'}</div>
                <div className="text-xs text-gray-500">{new Date(result.eventDate).toLocaleDateString()}</div>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <button onClick={() => openEditModal(result._id)} className="inline-flex items-center p-2 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors text-xs" title="Edit Result"><Edit2 className="w-4 h-4 mr-1" /> Edit</button>
                <button onClick={() => deleteResult(result._id)} className="inline-flex items-center p-2 bg-red-100 hover:bg-red-200 rounded-md transition-colors text-xs" title="Delete Result"><Trash2 className="w-4 h-4 mr-1" /> Delete</button>
                <button onClick={() => handleDownloadCertificate(result)} className="inline-flex items-center p-2 bg-green-100 hover:bg-green-200 rounded-md transition-colors text-xs" title="Download Certificate"><Download className="w-4 h-4 mr-1" /> Certificate</button>
              </div>
            </div>
            <div>
              <div className="font-semibold text-xs text-gray-700 mb-1">Group Results</div>
              <div className="flex flex-col gap-1">
                {['first', 'second', 'third'].map((place, idx) => {
                  const pos = result.group && result.group[place as keyof typeof result.group];
                  return pos && pos.name ? (
                    <div key={place} className="flex items-center gap-1 text-[11px]">
                      <span className={["text-yellow-600", "text-gray-600", "text-orange-600"][idx]}>{["\uD83E\uDD47", "\uD83E\uDD48", "\uD83E\uDD49"][idx]}</span>
                      <span className="font-medium">{pos.name}</span>
                      {pos.details && <span className="text-gray-400">({pos.details})</span>}
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Table for tablet/desktop */}
      <div className="overflow-x-auto w-full hidden sm:block">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-3 gap-2">
          <h2 className="text-xl font-bold text-gray-900">Group Event Results</h2>
        </div>
        <table className="min-w-full bg-white rounded-md shadow border border-gray-100 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Event Name</th>
              <th className="px-3 py-2 text-left font-medium">Category</th>
              <th className="px-3 py-2 text-left font-medium">Date</th>
              <th className="px-3 py-2 text-left font-medium">Group Results</th>
              <th className="px-3 py-2 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result._id} className="border-b last:border-b-0 hover:bg-blue-50 transition-colors">
                <td className="px-3 py-2 font-semibold whitespace-nowrap">{result.eventName}</td>
                <td className="px-3 py-2 whitespace-nowrap">{result.category?.name || 'Unknown'}</td>
                <td className="px-3 py-2 whitespace-nowrap">{new Date(result.eventDate).toLocaleDateString()}</td>
                <td className="px-3 py-2">
                  {['first', 'second', 'third'].map((place, idx) => {
                    const pos = result.group && result.group[place as keyof typeof result.group];
                    return pos && pos.name ? (
                      <div key={place} className="flex items-center gap-1 text-xs">
                        <span className={["text-yellow-600", "text-gray-600", "text-orange-600"][idx]}>{["\uD83E\uDD47", "\uD83E\uDD48", "\uD83E\uDD49"][idx]}</span>
                        <span className="font-medium">{pos.name}</span>
                        {pos.details && <span className="text-gray-400">({pos.details})</span>}
                      </div>
                    ) : null;
                  })}
                </td>
                <td className="px-3 py-2 text-center">
                  <button onClick={() => openEditModal(result._id)} className="inline-flex items-center px-2 py-1 text-xs text-blue-600 hover:text-blue-800"><Edit2 className="w-4 h-4 mr-1" /> Edit</button>
                  <button onClick={() => deleteResult(result._id)} className="inline-flex items-center px-2 py-1 text-xs text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4 mr-1" /> Delete</button>
                  <button onClick={() => handleDownloadCertificate(result)} className="inline-flex items-center px-2 py-1 text-xs text-green-600 hover:text-green-800"><Download className="w-4 h-4 mr-1" /> Certificate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Edit Modal */}
      {editResult && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button onClick={closeEditModal} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">&times;</button>
            <ResultForm result={editResult} onSuccess={handleEditSuccess} onCancel={closeEditModal} />
          </div>
        </div>
      )}
      {/* Certificate Modal */}
      {certificateResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative flex flex-col items-center">
            <button onClick={handleCloseCertificate} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">&times;</button>
            <div ref={certificateRef} className="w-full">
              <Certificate result={certificateResult} id="certificate-group" />
            </div>
            <button onClick={handleExportImage} disabled={downloading} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all disabled:opacity-60">
              {downloading ? 'Downloading...' : 'Download as Image'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupResultList; 