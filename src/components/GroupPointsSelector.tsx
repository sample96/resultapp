import React, { useState, useEffect } from 'react';
import { Trophy, Users, Search, RefreshCw, Plus, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';

interface Group {
  name: string;
  totalPoints: number;
  events: Array<{
    eventName: string;
    category: string;
    points: number;
    position: string;
    date: string;
  }>;
  firstPlace: number;
  secondPlace: number;
  thirdPlace: number;
}

interface Position {
  name: string;
  details: string;
}

interface Result {
  _id: string;
  eventName?: string;
  eventDate?: string;
  category: {
    _id: string;
    name: string;
  };
  individual?: {
    first: Position;
    second: Position;
    third: Position;
  } | null;
  group: {
    positions: Array<{
      groupId: {
        _id: string;
        name: string;
        description: string;
        points: number;
        isActive: boolean;
        memberCount: number;
        totalPoints: number;
        achievements: Array<{
          eventName: string;
          position: string;
          points: number;
          date: string;
        }>;
        createdAt: string;
        updatedAt: string;
      };
      name: string;
      details: string;
      points: number;
      _id: string;
    }>;
    totalGroups: number;
  };
}

const GroupPointsSelector: React.FC = () => {
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [allResults, setAllResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [pointsToAdd, setPointsToAdd] = useState<{ [groupId: string]: number }>({});
  const [calculatedTotals, setCalculatedTotals] = useState<{ [groupId: string]: number }>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [groupsResponse, resultsResponse] = await Promise.all([
        api.get('/results/groups'),
        api.get('/results')
      ]);
      
      setAllGroups(groupsResponse.data);
      setAllResults(resultsResponse.data.filter((r: Result) => r.group && r.group.positions && r.group.positions.length > 0));
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredGroups = allGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePointsChange = (groupName: string, points: number) => {
    setPointsToAdd(prev => ({
      ...prev,
      [groupName]: points
    }));
    
    // Calculate the new total
    const group = allGroups.find(g => g.name === groupName);
    if (group) {
      const newTotal = group.totalPoints + points;
      setCalculatedTotals(prev => ({
        ...prev,
        [groupName]: newTotal
      }));
    }
  };

  const handleGroupSelect = (groupName: string) => {
    const newSelected = new Set(selectedGroups);
    if (newSelected.has(groupName)) {
      newSelected.delete(groupName);
      // Remove from pointsToAdd when deselected
      setPointsToAdd(prev => {
        const newPoints = { ...prev };
        delete newPoints[groupName];
        return newPoints;
      });
      // Remove from calculatedTotals when deselected
      setCalculatedTotals(prev => {
        const newTotals = { ...prev };
        delete newTotals[groupName];
        return newTotals;
      });
    } else {
      newSelected.add(groupName);
      // Pre-populate with 0 when selected
      const group = allGroups.find(g => g.name === groupName);
      if (group) {
        setPointsToAdd(prev => ({
          ...prev,
          [groupName]: 0
        }));
        setCalculatedTotals(prev => ({
          ...prev,
          [groupName]: group.totalPoints
        }));
      }
    }
    setSelectedGroups(newSelected);
  };

  const handleAddPoints = async () => {
    if (selectedGroups.size === 0) {
      toast.error('Please select at least one group');
      return;
    }

    const hasPoints = Object.values(pointsToAdd).some(points => points > 0);
    if (!hasPoints) {
      toast.error('Please enter points to add');
      return;
    }

    try {
      // Update points for each selected group by updating the actual result data
      const updatePromises = Array.from(selectedGroups).map(async (groupName) => {
        const pointsToAddValue = pointsToAdd[groupName] || 0;
        
        // Find the group by name to get its current total points
        const group = allGroups.find(g => g.name === groupName);
        if (!group) {
          console.warn(`Group not found: ${groupName}`);
          return;
        }
        
        console.log(`🔄 Updating group ${groupName} - Adding ${pointsToAddValue} points to current ${group.totalPoints}`);
        
        // Find all results that contain this group and update their points
        const resultsToUpdate = allResults.filter(result => 
          result.group.positions.some(pos => pos.name === groupName)
        );
        
                  // Update each result that contains this group
          const resultUpdatePromises = resultsToUpdate.map(async (result) => {
            const updatedPositions = result.group.positions.map(pos => {
              if (pos.name === groupName) {
                // Calculate the new points for this position
                const currentPositionPoints = pos.points || 0;
                const newPositionPoints = currentPositionPoints + pointsToAddValue;
                return { 
                  name: pos.name,
                  details: pos.details,
                  points: newPositionPoints,
                  groupId: typeof pos.groupId === 'string' ? pos.groupId : pos.groupId._id
                };
              }
              return {
                name: pos.name,
                details: pos.details,
                points: pos.points || 0,
                groupId: typeof pos.groupId === 'string' ? pos.groupId : pos.groupId._id
              };
            });
            
            // Update the result with new position points
            return api.put(`/results/${result._id}`, {
              category: result.category._id,
              individual: result.individual,
              group: {
                ...result.group,
                positions: updatedPositions
              }
            });
          });
        
        return Promise.all(resultUpdatePromises);
      });

      await Promise.all(updatePromises);
      
      toast.success('Group points added successfully!');
      setSelectedGroups(new Set());
      setPointsToAdd({});
      setCalculatedTotals({});
      fetchData(); // Refresh data
    } catch (error) {
      console.error('❌ Error updating group points:', error);
      toast.error('Failed to update group points');
    }
  };

  const handleQuickAddPoints = async (result: Result, positionIndex: number, points: number) => {
    try {
      const position = result.group.positions[positionIndex];
      if (!position) {
        toast.error('Position not found');
        return;
      }

      console.log(`🔄 Quick updating position ${position.name} to ${points} points`);
      
      // Update the position's points in the result
      const updatedPositions = result.group.positions.map((pos, index) => {
        if (index === positionIndex) {
          return { 
            name: pos.name,
            details: pos.details,
            points: points,
            groupId: typeof pos.groupId === 'string' ? pos.groupId : pos.groupId._id
          };
        }
        return {
          name: pos.name,
          details: pos.details,
          points: pos.points || 0,
          groupId: typeof pos.groupId === 'string' ? pos.groupId : pos.groupId._id
        };
      });
      
      // Update the result with new position points
      await api.put(`/results/${result._id}`, {
        category: result.category._id,
        individual: result.individual,
        group: {
          ...result.group,
          positions: updatedPositions
        }
      });
      
      toast.success(`Updated ${position.name} to ${points} points`);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('❌ Error updating group points:', error);
      toast.error('Failed to update points');
    }
  };

  const getPositionIcon = (position: string) => {
    switch (position) {
      case '1st': return <Award className="w-4 h-4 text-yellow-500" />;
      case '2nd': return <Award className="w-4 h-4 text-gray-400" />;
      case '3rd': return <Award className="w-4 h-4 text-orange-500" />;
      default: return <Award className="w-4 h-4 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Loading Groups...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-100/50 shadow-sm sticky top-0 z-10">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Group Points Selector</h1>
                <p className="text-sm sm:text-base text-gray-600">Select groups and update their total points</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <button
                onClick={fetchData}
                disabled={refreshing}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 text-sm sm:text-base"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">Refresh</span>
              </button>
              
              {selectedGroups.size > 0 && (
                <button
                  onClick={handleAddPoints}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Points ({selectedGroups.size} groups)</span>
                  <span className="sm:hidden">Add ({selectedGroups.size})</span>
                </button>
              )}
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
        {allGroups.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-6 sm:p-8 text-center">
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Groups Available</h3>
            <p className="text-sm sm:text-base text-gray-500">
              No groups found in the results. Create some group results first.
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* Groups List */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100/50">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  Available Groups ({filteredGroups.length})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-100/50">
                {filteredGroups.map((group, index) => (
                  <div key={`${group.name}-${index}`} className="p-4 sm:p-6 hover:bg-gray-50/50 transition-colors duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                      <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                        <input
                          type="checkbox"
                          checked={selectedGroups.has(group.name)}
                          onChange={() => handleGroupSelect(group.name)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1 sm:mt-0"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{group.name}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                              {group.totalPoints} points
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                              {group.events.length} events
                            </span>
                          </div>
                          {selectedGroups.has(group.name) && (
                            <div className="mt-2 text-xs text-blue-600">
                              Current points: {group.totalPoints} • Enter points to add below
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {selectedGroups.has(group.name) && (
                        <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-center">
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-600">Current Points</label>
                            <div className="w-20 sm:w-24 px-2 sm:px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-700">
                              {calculatedTotals[group.name] || group.totalPoints}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-600">Points to Add</label>
                            <input
                              type="number"
                              value={pointsToAdd[group.name] || 0}
                              onChange={(e) => handlePointsChange(group.name, parseInt(e.target.value) || 0)}
                              className="w-20 sm:w-24 px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="0"
                              min="0"
                            />
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-gray-600">pts</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Results */}
         
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupPointsSelector;
