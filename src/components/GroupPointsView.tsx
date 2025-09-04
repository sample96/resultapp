import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, TrendingUp, Users, Calendar, Award, Search, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import type { GroupPointsSummary } from '../types';

const GroupPointsView: React.FC = () => {
  const [groupPoints, setGroupPoints] = useState<GroupPointsSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  useEffect(() => {
    fetchGroupPoints();
  }, []);

  const fetchGroupPoints = async () => {
    try {
      const response = await api.get('/results/group-points');
      setGroupPoints(response.data);
    } catch (error) {
      toast.error('Failed to fetch group points');
    } finally {
      setLoading(false);
    }
  };

  const getPositionIcon = (position: string) => {
    switch (position) {
      case '1st': return <Medal className="w-4 h-4 text-yellow-500" />;
      case '2nd': return <Medal className="w-4 h-4 text-gray-400" />;
      case '3rd': return <Medal className="w-4 h-4 text-orange-500" />;
      default: return <Star className="w-4 h-4 text-blue-500" />;
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case '1st': return 'text-yellow-600 bg-yellow-100';
      case '2nd': return 'text-gray-600 bg-gray-100';
      case '3rd': return 'text-orange-600 bg-orange-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const filteredGroups = groupPoints.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedGroupData = selectedGroup 
    ? groupPoints.find(group => group.name === selectedGroup)
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Loading Group Points...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-100/50 shadow-sm sticky top-0 z-10">
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Group Points Leaderboard</h1>
              <p className="text-sm sm:text-base text-gray-600">Track group performance across all Mawlid events</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {groupPoints.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-6 sm:p-8 text-center">
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Group Points Available</h3>
            <p className="text-sm sm:text-base text-gray-500">
              Group points will be displayed here once events are completed.
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredGroups.slice(0, 3).map((group, index) => (
                <div
                  key={group.name}
                  className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-4 sm:p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    index === 0 ? 'ring-2 ring-yellow-400 scale-105' :
                    index === 1 ? 'ring-2 ring-gray-400 scale-102' :
                    index === 2 ? 'ring-2 ring-orange-400' : ''
                  }`}
                  onClick={() => setSelectedGroup(group.name)}
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      {index === 0 && <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />}
                      <div className={`text-2xl sm:text-4xl font-bold ${
                        index === 0 ? 'text-yellow-600' :
                        index === 1 ? 'text-gray-600' :
                        'text-orange-600'
                      }`}>
                        #{index + 1}
                      </div>
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{group.name}</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-3 sm:mb-4">{group.totalPoints}</div>
                    <div className="text-xs sm:text-sm text-gray-500">Total Points</div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 sm:gap-4 mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Medal className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                        {group.firstPlace}
                      </div>
                      <div className="flex items-center gap-1">
                        <Medal className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                        {group.secondPlace}
                      </div>
                      <div className="flex items-center gap-1">
                        <Medal className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                        {group.thirdPlace}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Full Leaderboard */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Complete Leaderboard</h2>
              </div>
              
              {/* Mobile Cards View */}
              <div className="block sm:hidden">
                <div className="divide-y divide-gray-200">
                  {filteredGroups.map((group, index) => (
                    <div 
                      key={group.name} 
                      className={`p-4 cursor-pointer transition-colors duration-200 ${
                        selectedGroup === group.name ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedGroup(group.name)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{group.name}</div>
                            <div className="text-lg font-bold text-blue-600">{group.totalPoints} pts</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="flex items-center gap-1">
                          <Medal className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-gray-900">{group.firstPlace}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Medal className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-900">{group.secondPlace}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Medal className="w-3 h-3 text-orange-500" />
                          <span className="text-xs text-gray-900">{group.thirdPlace}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {group.events.slice(0, 3).map((event, eventIndex) => (
                          <span
                            key={eventIndex}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(event.position)}`}
                          >
                            {getPositionIcon(event.position)}
                            {event.points}p
                          </span>
                        ))}
                        {group.events.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{group.events.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Group Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Points
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Achievements
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recent Performance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredGroups.map((group, index) => (
                      <tr 
                        key={group.name} 
                        className={`hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                          selectedGroup === group.name ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedGroup(group.name)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800' :
                              index === 1 ? 'bg-gray-100 text-gray-800' :
                              index === 2 ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {index + 1}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{group.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-blue-600">{group.totalPoints}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Medal className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm text-gray-900">{group.firstPlace}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Medal className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-900">{group.secondPlace}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Medal className="w-4 h-4 text-orange-500" />
                              <span className="text-sm text-gray-900">{group.thirdPlace}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {group.events.slice(0, 3).map((event, eventIndex) => (
                              <span
                                key={eventIndex}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(event.position)}`}
                              >
                                {getPositionIcon(event.position)}
                                {event.points}p
                              </span>
                            ))}
                            {group.events.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{group.events.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected Group Details */}
            {selectedGroupData && (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      {selectedGroupData.name} - Detailed Performance
                    </h2>
                    <button
                      onClick={() => setSelectedGroup(null)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-blue-600">{selectedGroupData.totalPoints}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Total Points</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-yellow-50 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-yellow-600">{selectedGroupData.firstPlace}</div>
                      <div className="text-xs sm:text-sm text-gray-600">1st Place Wins</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-gray-600">{selectedGroupData.events.length}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Events Participated</div>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Event History</h3>
                  <div className="space-y-3">
                    {selectedGroupData.events
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((event, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getPositionColor(event.position)}`}>
                              {getPositionIcon(event.position)}
                              {event.position}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{event.eventName || 'Competition'}</div>
                              <div className="text-xs sm:text-sm text-gray-500">{event.category}</div>
                            </div>
                          </div>
                          <div className="text-right self-end sm:self-center">
                            <div className="text-base sm:text-lg font-bold text-blue-600">{event.points} pts</div>
                            <div className="text-xs sm:text-sm text-gray-500">
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupPointsView;
