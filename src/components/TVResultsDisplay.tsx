import React, { useState, useEffect } from 'react';
import { Award, Calendar, Trophy } from 'lucide-react';
import { api } from '../services/api';
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

const TVResultsDisplay: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('individual');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    if (autoPlay && results.length > 0) {
      const interval = setInterval(() => {
        setCurrentResultIndex((prev) => (prev + 1) % results.length);
      }, 8000); // Change result every 8 seconds

      return () => clearInterval(interval);
    }
  }, [autoPlay, results.length]);

  const fetchResults = async () => {
    try {
      const response = await api.get('/results');
      const filteredResults = response.data.filter((r: Result) => {
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
      setResults(filteredResults);
    } catch (error) {
      console.error('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [activeTab]);

  const currentResult = results[currentResultIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src="/logo.png" 
              alt="ResultApp Logo" 
              className="w-16 h-16 rounded-2xl shadow-lg p-2"
            />
          </div>
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white">Loading Results...</h2>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src="/logo.png" 
              alt="ResultApp Logo" 
              className="w-16 h-16 rounded-2xl shadow-lg p-2"
            />
          </div>
          <Award className="w-16 h-16 text-white mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Results Available</h2>
          <p className="text-blue-200">No {activeTab}  results found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <img 
                src="/logo.png" 
                alt="ResultApp Logo" 
                className="w-16 h-16 rounded-2xl shadow-lg  p-2"
              />
              <h1 className="text-4xl lg:text-6xl font-bold text-white">
                 Results
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('individual')}
                className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${
                  activeTab === 'individual'
                    ? 'bg-white text-blue-900 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                Individual Results
              </button>
              <button
                onClick={() => setActiveTab('group')}
                className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${
                  activeTab === 'group'
                    ? 'bg-white text-blue-900 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                Group Results
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                autoPlay ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
            >
              {autoPlay ? 'Auto Play ON' : 'Auto Play OFF'}
            </button>
            <div className="text-white text-sm">
              {currentResultIndex + 1} / {results.length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-12 max-w-6xl w-full">
          {currentResult && (
            <div className="text-center">
              {/* Event Info */}
              <div className="mb-8">
                <h2 className="text-5xl lg:text-7xl font-bold text-white mb-4">
                  {currentResult.eventName}
                </h2>
                <div className="flex items-center justify-center gap-6 text-xl text-blue-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-6 h-6" />
                    {new Date(currentResult.eventDate).toLocaleDateString()}
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-full">
                    {currentResult.category.name}
                  </div>
                </div>
              </div>

              {/* Results Display */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {activeTab === 'individual' && currentResult.individual && (
                  <>
                    {currentResult.individual.first && (
                      <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-8 text-white transform hover:scale-105 transition-transform duration-300">
                        <div className="text-6xl mb-4">🥇</div>
                        <h3 className="text-3xl font-bold mb-2">1st Place</h3>
                        <p className="text-xl">{currentResult.individual.first.name}</p>
                        {currentResult.individual.first.details && (
                          <p className="text-sm mt-2 opacity-80">{currentResult.individual.first.details}</p>
                        )}
                      </div>
                    )}
                    {currentResult.individual.second && (
                      <div className="bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl p-8 text-white transform hover:scale-105 transition-transform duration-300">
                        <div className="text-6xl mb-4">🥈</div>
                        <h3 className="text-3xl font-bold mb-2">2nd Place</h3>
                        <p className="text-xl">{currentResult.individual.second.name}</p>
                        {currentResult.individual.second.details && (
                          <p className="text-sm mt-2 opacity-80">{currentResult.individual.second.details}</p>
                        )}
                      </div>
                    )}
                    {currentResult.individual.third && (
                      <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-8 text-white transform hover:scale-105 transition-transform duration-300">
                        <div className="text-6xl mb-4">🥉</div>
                        <h3 className="text-3xl font-bold mb-2">3rd Place</h3>
                        <p className="text-xl">{currentResult.individual.third.name}</p>
                        {currentResult.individual.third.details && (
                          <p className="text-sm mt-2 opacity-80">{currentResult.individual.third.details}</p>
                        )}
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'group' && currentResult.group && (
                  <>
                    {currentResult.group.first && (
                      <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-8 text-white transform hover:scale-105 transition-transform duration-300">
                        <div className="text-6xl mb-4">🥇</div>
                        <h3 className="text-3xl font-bold mb-2">1st Place</h3>
                        <p className="text-xl">{currentResult.group.first.name}</p>
                        {currentResult.group.first.details && (
                          <p className="text-sm mt-2 opacity-80">{currentResult.group.first.details}</p>
                        )}
                      </div>
                    )}
                    {currentResult.group.second && (
                      <div className="bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl p-8 text-white transform hover:scale-105 transition-transform duration-300">
                        <div className="text-6xl mb-4">🥈</div>
                        <h3 className="text-3xl font-bold mb-2">2nd Place</h3>
                        <p className="text-xl">{currentResult.group.second.name}</p>
                        {currentResult.group.second.details && (
                          <p className="text-sm mt-2 opacity-80">{currentResult.group.second.details}</p>
                        )}
                      </div>
                    )}
                    {currentResult.group.third && (
                      <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-8 text-white transform hover:scale-105 transition-transform duration-300">
                        <div className="text-6xl mb-4">🥉</div>
                        <h3 className="text-3xl font-bold mb-2">3rd Place</h3>
                        <p className="text-xl">{currentResult.group.third.name}</p>
                        {currentResult.group.third.details && (
                          <p className="text-sm mt-2 opacity-80">{currentResult.group.third.details}</p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
        {results.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentResultIndex(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentResultIndex ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TVResultsDisplay;
