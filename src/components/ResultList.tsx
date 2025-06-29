import React, { useState, useEffect } from 'react';
import { Download, Calendar, Trophy, Users, User, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';

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
}

const ResultList: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

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

  const downloadPDF = async (resultId: string, eventName: string) => {
    try {
      const response = await api.get(`/results/${resultId}/pdf`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${eventName.replace(/\s+/g, '-')}-results.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download PDF');
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

  const renderPosition = (position: Position | null | undefined, rank: number) => {
    if (!position || !position.name) return null;
    
    const colors = ['text-yellow-600', 'text-gray-600', 'text-orange-600'];
    const medals = ['🥇', '🥈', '🥉'];
    
    return (
      <div className="flex items-start space-x-2">
        <span className="text-lg">{medals[rank]}</span>
        <div>
          <span className={`font-semibold ${colors[rank]}`}>{position.name}</span>
          {position.details && (
            <p className="text-sm text-gray-600 mt-1">{position.details}</p>
          )}
        </div>
      </div>
    );
  };

  // Helper function to safely get positions
  const getPositions = (resultSection: { first: Position; second: Position; third: Position; } | null) => {
    if (!resultSection) {
      return [null, null, null];
    }
    return [resultSection.first, resultSection.second, resultSection.third];
  };

  // Helper function to check if any positions exist
  const hasAnyPositions = (resultSection: { first: Position; second: Position; third: Position; } | null) => {
    if (!resultSection) return false;
    return resultSection.first?.name || resultSection.second?.name || resultSection.third?.name;
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
      <div className="text-center py-12">
        <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Results Yet</h3>
        <p className="text-gray-500">Create your first event result to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Results</h2>
      
      {results.map((result) => (
        <div key={result._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold mb-2">{result.eventName}</h3>
                <div className="flex items-center space-x-4 text-blue-100">
                  <div className="flex items-center">
                    <Trophy className="w-4 h-4 mr-1" />
                    <span>{result.category?.name || 'Unknown Category'}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(result.eventDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => downloadPDF(result._id, result.eventName)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  title="Download PDF"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteResult(result._id)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                  title="Delete Result"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Individual Results */}
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <User className="w-5 h-5 text-blue-600 mr-2" />
                  <h4 className="text-lg font-semibold text-gray-900">Individual Results</h4>
                </div>
                
                <div className="space-y-3">
                  {getPositions(result.individual).map((position, index) => (
                    <div key={index}>
                      {renderPosition(position, index)}
                    </div>
                  ))}
                  
                  {!hasAnyPositions(result.individual) && (
                    <p className="text-gray-500 italic">No individual results recorded</p>
                  )}
                </div>
              </div>

              {/* Group Results */}
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <Users className="w-5 h-5 text-green-600 mr-2" />
                  <h4 className="text-lg font-semibold text-gray-900">Group Results</h4>
                </div>
                
                <div className="space-y-3">
                  {getPositions(result.group).map((position, index) => (
                    <div key={index}>
                      {renderPosition(position, index)}
                    </div>
                  ))}
                  
                  {!hasAnyPositions(result.group) && (
                    <p className="text-gray-500 italic">No group results recorded</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultList;