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

const ResultList: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
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
      setResults(response.data);
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
    // Ensure category matches the expected type
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
      console.error('Certificate element not found');
      toast.error('Certificate element not found');
      return;
    }

    // Ensure element is visible and properly rendered
    certElement.scrollIntoView({ behavior: 'auto', block: 'center' });
    
    // Wait a bit longer for rendering
    await new Promise(res => setTimeout(res, 500));
    
    // Additional check to ensure element has dimensions
    const rect = certElement.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      console.error('Certificate element has no dimensions');
      toast.error('Certificate element not properly rendered');
      return;
    }

    console.log('Element dimensions:', rect.width, 'x', rect.height);
    
    // Create canvas with better options
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
    
    // Convert to blob for better browser compatibility
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Failed to create blob from canvas');
        toast.error('Failed to create image file');
        return;
      }
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${certificateResult.eventName}_certificate.png`;
      link.href = url;
      
      // Ensure link is added to DOM for some browsers
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up object URL
      URL.revokeObjectURL(url);
      
      toast.success('Certificate image downloaded!');
    }, 'image/png', 1.0);
    
  } catch (error) {
    console.error('Error generating certificate image:', error);
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
        <h3 className="text-lg font-semibold text-gray-500 mb-1">No Results Yet</h3>
        <p className="text-gray-400 text-sm">Create your first event result to get started!</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-3 gap-2">
          <h2 className="text-xl font-bold text-gray-900">Event Results</h2>
        </div>
        <table className="min-w-full bg-white rounded-md shadow border border-gray-100 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Event Name</th>
              <th className="px-3 py-2 text-left font-medium">Category</th>
              <th className="px-3 py-2 text-left font-medium">Date</th>
              <th className="px-3 py-2 text-left font-medium">Individual Results</th>
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
                    const pos = result.individual && result.individual[place as keyof typeof result.individual];
                    return pos && pos.name ? (
                      <div key={place} className="flex items-center gap-1 text-xs">
                        <span className={["text-yellow-600", "text-gray-600", "text-orange-600"][idx]}>
                          {["\uD83E\uDD47", "\uD83E\uDD48", "\uD83E\uDD49"][idx]}
                        </span>
                        <span className="font-medium">{pos.name}</span>
                        {pos.details && <span className="text-gray-400">({pos.details})</span>}
                      </div>
                    ) : null;
                  })}
                </td>
                <td className="px-3 py-2">
                  {['first', 'second', 'third'].map((place, idx) => {
                    const pos = result.group && result.group[place as keyof typeof result.group];
                    return pos && pos.name ? (
                      <div key={place} className="flex items-center gap-1 text-xs">
                        <span className={["text-yellow-600", "text-gray-600", "text-orange-600"][idx]}>
                          {["\uD83E\uDD47", "\uD83E\uDD48", "\uD83E\uDD49"][idx]}
                        </span>
                        <span className="font-medium">{pos.name}</span>
                        {pos.details && <span className="text-gray-400">({pos.details})</span>}
                      </div>
                    ) : null;
                  })}
                </td>
                <td className="px-3 py-2 text-center space-x-1">
                  <button
                    onClick={() => openEditModal(result._id)}
                    className="inline-flex items-center p-2 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
                    title="Edit Result"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteResult(result._id)}
                    className="inline-flex items-center p-2 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
                    title="Delete Result"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownloadCertificate(result)}
                    className="inline-flex items-center p-2 bg-green-100 hover:bg-green-200 rounded-md transition-colors"
                    title="Download Certificate"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Edit Modal */}
        {editResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-md relative overflow-y-auto max-h-[90vh]">
              <button onClick={closeEditModal} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
              <h2 className="text-lg font-bold mb-4 text-gray-900">Edit Result</h2>
              <ResultForm result={editResult} onSuccess={handleEditSuccess} onCancel={closeEditModal} />
            </div>
          </div>
        )}
      </div>
      {/* Certificate Modal rendered at root for html2canvas reliability */}
      {certificateResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-lg relative overflow-y-auto max-h-[90vh] flex flex-col items-center">
            <button onClick={handleCloseCertificate} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            <div ref={certificateRef} id="certificate-preview" className="w-full flex justify-center">
              <Certificate result={certificateResult} />
            </div>
            <button
              onClick={handleExportImage}
              className="mt-4 px-6 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-150 disabled:opacity-60"
              disabled={downloading}
            >
              {downloading ? 'Downloading...' : 'Download as Image'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ResultList;