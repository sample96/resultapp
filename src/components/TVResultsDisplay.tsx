import React, { useState, useEffect } from 'react';
import { Award, Calendar, Trophy, Medal } from 'lucide-react';
import { api } from '../services/api';
import type { Result as ResultType, GroupPointsSummary } from '../types';

interface Category {
  _id: string;
  name: string;
}

interface Position {
  name: string;
  details: string;
}

interface GroupPosition {
  groupId: string;
  name: string;
  details: string;
  points: number;
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
    positions: GroupPosition[];
    totalGroups: number;
  } | null;
  createdAt: string;
  updatedAt: Date;
}

type TabType = 'individual' | 'group' | 'points';

const TVResultsDisplay: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('individual');
  const [results, setResults] = useState<Result[]>([]);
  const [groupPoints, setGroupPoints] = useState<GroupPointsSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [currentPointsIndex, setCurrentPointsIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    fetchResults();
    fetchGroupPoints();
  }, []);

  useEffect(() => {
    if (autoPlay && results.length > 0 && activeTab !== 'points') {
      const interval = setInterval(() => {
        setCurrentResultIndex((prev) => (prev + 1) % results.length);
      }, 8000); // Change result every 8 seconds

      return () => clearInterval(interval);
    }
  }, [autoPlay, results.length, activeTab]);

  useEffect(() => {
    if (autoPlay && groupPoints.length > 0 && activeTab === 'points') {
      const interval = setInterval(() => {
        setCurrentPointsIndex((prev) => (prev + 1) % groupPoints.length);
      }, 6000); // Change points display every 6 seconds

      return () => clearInterval(interval);
    }
  }, [autoPlay, groupPoints.length, activeTab]);

  const fetchResults = async () => {
    try {
      const response = await api.get('/results');
      const filteredResults = response.data.filter((r: Result) => {
        if (activeTab === 'individual') {
          return r.individual && (
            r.individual.first?.name || r.individual.second?.name || r.individual.third?.name
          );
        } else if (activeTab === 'group') {
          return r.group && r.group.positions && r.group.positions.length > 0;
        }
        return false;
      });
      setResults(filteredResults);
    } catch (error) {
      console.error('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupPoints = async () => {
    try {
      const response = await api.get('/results/group-points');
      setGroupPoints(response.data);
    } catch (error) {
      console.error('Failed to fetch group points');
    }
  };

  useEffect(() => {
    fetchResults();
  }, [activeTab]);

  const currentResult = results[currentResultIndex];
  const currentPointsData = groupPoints[currentPointsIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4">
            <img 
              src="/logo.png" 
              alt="ResultApp Logo" 
              className="w-8 h-8 sm:w-16 sm:h-16 rounded-2xl shadow-lg p-1 sm:p-2"
            />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 sm:h-16 sm:w-16 border-b-4 border-white mx-auto mb-4"></div>
          <h2 className="text-lg sm:text-2xl font-bold text-white">Loading Results...</h2>
        </div>
      </div>
    );
  }

  if (results.length === 0 && groupPoints.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4">
            <img 
              src="/logo.png" 
              alt="ResultApp Logo" 
              className="w-8 h-8 sm:w-16 sm:h-16 rounded-2xl shadow-lg p-1 sm:p-2"
            />
          </div>
          <Award className="w-8 h-8 sm:w-16 sm:h-16 text-white mx-auto mb-4" />
          <h2 className="text-lg sm:text-2xl font-bold text-white mb-2">No Results Available</h2>
          <p className="text-blue-200 text-sm sm:text-base">No {activeTab} results found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
          {/* Left Section - Logo and Title */}
          <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 lg:gap-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <img 
                src="/logo.png" 
                alt="ResultApp Logo" 
                className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-2xl shadow-lg p-1 sm:p-2"
              />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white">
                Results
              </h1>
            </div>
          </div>

          {/* Center Section - Tab Buttons */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
            <button
              onClick={() => setActiveTab('individual')}
              className={`px-4 py-2 sm:px-5 sm:py-2 lg:px-6 lg:py-3 rounded-full text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300 ${
                activeTab === 'individual'
                  ? 'bg-white text-blue-900 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Individual
            </button>
            <button
              onClick={() => setActiveTab('group')}
              className={`px-4 py-2 sm:px-5 sm:py-2 lg:px-6 lg:py-3 rounded-full text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300 ${
                activeTab === 'group'
                  ? 'bg-white text-blue-900 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Group
            </button>
            <button
              onClick={() => setActiveTab('points')}
              className={`px-4 py-2 sm:px-5 sm:py-2 lg:px-6 lg:py-3 rounded-full text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300 ${
                activeTab === 'points'
                  ? 'bg-white text-blue-900 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Points
            </button>
          </div>
          
          {/* Right Section - Controls */}
          <div className="flex items-center justify-center lg:justify-end gap-3 sm:gap-4">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`px-3 py-1 sm:px-4 sm:py-2 lg:px-5 lg:py-2 rounded-full text-sm sm:text-base font-medium ${
                autoPlay ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
            >
              {autoPlay ? 'Auto ON' : 'Auto OFF'}
            </button>
            <div className="text-white text-sm sm:text-base font-medium">
              {activeTab === 'points' 
                ? `${currentPointsIndex + 1} / ${groupPoints.length}`
                : `${currentResultIndex + 1} / ${results.length}`
              }
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24 lg:pt-32">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-white/20 p-6 sm:p-8 lg:p-12 max-w-7xl w-full mx-auto">
          {/* Points Display Section */}
          {activeTab === 'points' && groupPoints.length > 0 && (
            <div className="text-center">
              {/* Points Header */}
              <div className="mb-6 sm:mb-8 lg:mb-10">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4">
                  Group Points
                </h2>
                <div className="flex items-center justify-center gap-3 sm:gap-4 lg:gap-6 text-sm sm:text-base lg:text-lg text-blue-200">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                    <span>Total Groups: {groupPoints.length}</span>
                  </div>
                </div>
              </div>

              {/* Top 3 Podium Display */}
              <div className="flex justify-center">
                <div className={`grid gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 max-w-5xl w-full ${
                  groupPoints.length === 1 ? 'grid-cols-1' :
                  groupPoints.length === 2 ? 'grid-cols-2' :
                  'grid-cols-1 sm:grid-cols-3'
                }`}>
                  {groupPoints.slice(0, 3).map((group, index) => (
                    <div
                      key={group.name}
                      className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white transform hover:scale-105 transition-transform duration-300 text-center ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 ring-4 ring-yellow-300' :
                        index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600 ring-4 ring-gray-300' :
                        'bg-gradient-to-br from-orange-400 to-orange-600 ring-4 ring-orange-300'
                      }`}
                    >
                      <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">
                        #{index + 1} Place
                      </h3>
                      <p className="text-base sm:text-lg lg:text-xl mb-3 sm:mb-4">{group.name}</p>
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-200 mb-3 sm:mb-4">
                        {group.totalPoints} pts
                      </div>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
                        <div className="flex items-center gap-1">
                          <Medal className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300" />
                          <span>{group.firstPlace}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Medal className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
                          <span>{group.secondPlace}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Medal className="w-3 h-3 sm:w-4 sm:h-4 text-orange-300" />
                          <span>{group.thirdPlace}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

          
            </div>
          )}

          {/* Results Display for Individual and Group tabs */}
          {activeTab !== 'points' && currentResult && (
            <div className="text-center">
              {/* Event Info */}
              <div className="mb-6 sm:mb-8 lg:mb-10">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4">
                  {currentResult.eventName || 'Competition'}
                </h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-6 text-sm sm:text-base lg:text-lg text-blue-200">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                    <span>{currentResult.eventDate ? new Date(currentResult.eventDate).toLocaleDateString() : 'Date TBD'}</span>
                  </div>
                  <div className="bg-white/20 px-3 py-1 sm:px-4 sm:py-2 lg:px-5 lg:py-2 rounded-full text-sm sm:text-base">
                    {currentResult.category.name}
                  </div>
                </div>
              </div>

              {/* Results Display */}
              <div className={`grid gap-4 sm:gap-6 lg:gap-8 ${
                activeTab === 'individual' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
                activeTab === 'group' && currentResult.group ? 
                  (currentResult.group.positions.length === 1 ? 'grid-cols-1' :
                   currentResult.group.positions.length === 2 ? 'grid-cols-2' :
                   'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3') :
                'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }`}>
                {activeTab === 'individual' && currentResult.individual && (
                  <>
                    {currentResult.individual.first && (
                      <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white transform hover:scale-105 transition-transform duration-300">
                        <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">🥇</div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">1st Place</h3>
                        <p className="text-base sm:text-lg lg:text-xl">{currentResult.individual.first.name}</p>
                        {currentResult.individual.first.details && (
                          <p className="text-sm sm:text-base mt-2 sm:mt-3 opacity-80">{currentResult.individual.first.details}</p>
                        )}
                      </div>
                    )}
                    {currentResult.individual.second && (
                      <div className="bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white transform hover:scale-105 transition-transform duration-300">
                        <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">🥈</div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">2nd Place</h3>
                        <p className="text-base sm:text-lg lg:text-xl">{currentResult.individual.second.name}</p>
                        {currentResult.individual.second.details && (
                          <p className="text-sm sm:text-base mt-2 sm:mt-3 opacity-80">{currentResult.individual.second.details}</p>
                        )}
                      </div>
                    )}
                    {currentResult.individual.third && (
                      <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white transform hover:scale-105 transition-transform duration-300">
                        <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">🥉</div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">3rd Place</h3>
                        <p className="text-base sm:text-lg lg:text-xl">{currentResult.individual.third.name}</p>
                        {currentResult.individual.third.details && (
                          <p className="text-sm sm:text-base mt-2 sm:mt-3 opacity-80">{currentResult.individual.third.details}</p>
                        )}
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'group' && currentResult.group && (
                  <>
                    {currentResult.group.positions.map((position, index) => (
                      <div key={index} className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white transform hover:scale-105 transition-transform duration-300 ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                        index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                        index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                        'bg-gradient-to-br from-blue-400 to-blue-600'
                      }`}>
                        <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}
                        </div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">
                          {index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : `${index + 1}th`} Place
                        </h3>
                        <p className="text-base sm:text-lg lg:text-xl">{position.name}</p>
                        {position.details && (
                          <p className="text-sm sm:text-base mt-2 sm:mt-3 opacity-80">{position.details}</p>
                        )}
                        {position.points > 0 && (
                          <p className="text-lg sm:text-xl lg:text-2xl font-bold mt-3 sm:mt-4 text-yellow-200">{position.points} points</p>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3">
        {(activeTab === 'points' ? groupPoints : results).map((_, index) => (
          <button
            key={index}
            onClick={() => activeTab === 'points' ? setCurrentPointsIndex(index) : setCurrentResultIndex(index)}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
              (activeTab === 'points' ? index === currentPointsIndex : index === currentResultIndex) ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TVResultsDisplay;
