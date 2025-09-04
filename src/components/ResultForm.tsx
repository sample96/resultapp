import React, { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import { Trophy, Users, User, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import type { Group } from '../types';

interface Category {
  _id: string;
  name: string;
  description?: string;
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

type ResultType = 'individual' | 'group';

interface ResultFormData {
  category: string;
  resultType: ResultType;
  individual: {
    first: Position;
    second: Position;
    third: Position;
  } | null;
  group: {
    positions: GroupPosition[];
    totalGroups: number;
  } | null;
}

interface ResultFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
  result?: any; // For edit mode
  forcedResultType?: ResultType; // Force a specific result type (hides tab selection)
}

const ResultForm: React.FC<ResultFormProps> = ({ onSuccess, onCancel, result, forcedResultType }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ResultFormData>({
    category: '',
    resultType: forcedResultType || 'individual',
    individual: forcedResultType === 'individual' ? {
      first: { name: '', details: '' },
      second: { name: '', details: '' },
      third: { name: '', details: '' }
    } : null,
    group: forcedResultType === 'group' ? {
      positions: [],
      totalGroups: 0
    } : null
  });

  useEffect(() => {
    fetchCategories();
    fetchGroups();
    if (result) {
      // Pre-fill form for edit
      const isIndividual = result.individual && Object.keys(result.individual).length > 0;
      const isGroup = result.group && result.group.positions && result.group.positions.length > 0;
      
      setFormData({
        category: result.category?._id || '',
        resultType: isIndividual ? 'individual' : 'group',
        individual: isIndividual ? result.individual : null,
        group: isGroup ? {
          positions: result.group.positions.map((pos: any) => ({
            groupId: pos.groupId?._id || pos.groupId || '',
            name: pos.groupId?.name || pos.name || '',
            details: pos.details || '',
            points: pos.points || 0
          })),
          totalGroups: result.group.positions.length
        } : {
          positions: [],
          totalGroups: 0
        }
      });
    } else if (forcedResultType) {
      // Set the forced result type for new forms
      setFormData(prev => ({
        ...prev,
        resultType: forcedResultType,
        individual: forcedResultType === 'individual' ? {
          first: { name: '', details: '' },
          second: { name: '', details: '' },
          third: { name: '', details: '' }
        } : null,
        group: forcedResultType === 'group' ? {
          positions: [],
          totalGroups: 0
        } : null
      }));
    }
  }, [result, forcedResultType]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const fetchGroups = async () => {
    try {
      console.log('🔄 Fetching groups from API...');
      const response = await api.get('/groups');
      console.log('✅ Groups fetched successfully:', response.data.length, 'groups');
      
      if (response.data.length === 0) {
        console.warn('⚠️ No groups found. Please create groups first.');
        toast.warning('No groups available. Please create groups in the Group Manager first.');
      }
      
      setGroups(response.data);
    } catch (error) {
      console.error('❌ Failed to fetch groups:', error);
      toast.error('Failed to fetch groups. Please check your connection and try again.');
    }
  };

  const handleCategoryChange = async (newValue: any) => {
    if (newValue?.__isNew__) {
      // Create new category
      try {
        const response = await api.post('/categories', { name: newValue.label });
        setCategories(prev => [...prev, response.data]);
        setFormData(prev => ({ ...prev, category: response.data._id }));
        toast.success('New category created successfully!');
      } catch (error) {
        toast.error('Failed to create category');
      }
    } else {
      setFormData(prev => ({ ...prev, category: newValue?.value || '' }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleResultTypeChange = (type: ResultType) => {
    setFormData(prev => ({
      ...prev,
      resultType: type,
      // Reset positions when changing result type
      individual: type === 'individual' ? {
        first: { name: '', details: '' },
        second: { name: '', details: '' },
        third: { name: '', details: '' }
      } : null,
      group: type === 'group' ? {
        positions: [],
        totalGroups: 0
      } : null
    }));
  };

  const handlePositionChange = (position: 'first' | 'second' | 'third', field: 'name' | 'details' | 'points', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      positions: {
        ...prev.positions,
        [position]: {
          ...prev.positions[position],
          [field]: value
        }
      }
    }));
  };

  const handleIndividualPositionChange = (position: 'first' | 'second' | 'third', field: 'name' | 'details', value: string) => {
    setFormData(prev => ({
      ...prev,
      individual: prev.individual ? {
        ...prev.individual,
        [position]: {
          ...prev.individual[position],
          [field]: value
        }
      } : null
    }));
  };

  const handleGroupPositionChange = async (index: number, field: 'groupId' | 'name' | 'details' | 'points', value: string | number) => {
    console.log(`🔄 Updating group position ${index}, field: ${field}, value:`, value);
    
    setFormData(prev => ({
      ...prev,
      group: prev.group ? {
        ...prev.group,
        positions: prev.group.positions.map((pos, i) => {
          if (i === index) {
            const updatedPos = { ...pos, [field]: value };
            
            // If groupId is being changed, automatically populate the group name
            if (field === 'groupId' && typeof value === 'string') {
              const selectedGroup = groups.find(g => g._id === value);
              if (selectedGroup) {
                console.log('✅ Group selected:', selectedGroup.name);
                updatedPos.name = selectedGroup.name;
                // Also set the initial points to the group's current points
                updatedPos.points = selectedGroup.totalPoints || 0;
                console.log(`📊 Setting initial points to: ${updatedPos.points}`);
              } else {
                console.warn('⚠️ Group not found for ID:', value);
              }
            }
            
            // If points are being updated, also update the group's points (only if groupId is set)
            if (field === 'points' && typeof value === 'number' && updatedPos.groupId) {
              console.log(`🏆 Updating group ${updatedPos.groupId} with ${value} points`);
              updateGroupPoints(updatedPos.groupId, value);
            } else if (field === 'points' && typeof value === 'number' && !updatedPos.groupId) {
              console.log('⚠️ Cannot update group points - no group selected yet');
            }
            
            console.log(`📍 Updated position ${index}:`, updatedPos);
            return updatedPos;
          }
          return pos;
        })
      } : null
    }));
  };

  // Function to update group points via API
  const updateGroupPoints = async (groupId: string, newPoints: number) => {
    try {
      const selectedGroup = groups.find(g => g._id === groupId);
      if (!selectedGroup) {
        console.warn('⚠️ Group not found for updating points');
        return;
      }

      const updateData = {
        name: selectedGroup.name,
        description: selectedGroup.description,
        totalPoints: newPoints,
        isActive: selectedGroup.isActive
      };

      console.log('📤 Updating group points:', updateData);
      
      // Show loading toast
      const loadingToast = toast.loading(`Updating group points to ${newPoints}...`);
      
      const response = await api.put(`/groups/${groupId}`, updateData);
      console.log('✅ Group points updated successfully:', response.data);
      
      // Update the local groups state to reflect the change
      setGroups(prevGroups => 
        prevGroups.map(group => 
          group._id === groupId 
            ? { ...group, totalPoints: newPoints }
            : group
        )
      );
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success(`✅ Group points updated to ${newPoints}`);
    } catch (error) {
      console.error('❌ Failed to update group points:', error);
      toast.error('❌ Failed to update group points');
    }
  };

  const addGroupPosition = () => {
    setFormData(prev => ({
      ...prev,
      group: prev.group ? {
        ...prev.group,
        positions: [...prev.group.positions, {
          groupId: '',
          name: '',
          details: '',
          points: 0
        }],
        totalGroups: prev.group.positions.length + 1
      } : null
    }));
  };

  const removeGroupPosition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      group: prev.group ? {
        ...prev.group,
        positions: prev.group.positions.filter((_, i) => i !== index),
        totalGroups: prev.group.positions.length - 1
      } : null
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    // Validate group positions if it's a group result
    if (formData.resultType === 'group' && formData.group) {
      const invalidPositions = formData.group.positions.filter(pos => !pos.groupId);
      if (invalidPositions.length > 0) {
        toast.error('Please select a group for all positions');
        return;
      }
    }

    const submitData = {
      category: formData.category,
      individual: formData.resultType === 'individual' ? formData.individual : null,
      group: formData.resultType === 'group' ? formData.group : null,
    };

    console.log('📤 Submitting result data:', submitData);
    console.log('📊 Group positions:', formData.group?.positions);

    setLoading(true);
    try {
      if (result && result._id) {
        await api.put(`/results/${result._id}`, submitData);
        toast.success('Result updated successfully!');
      } else {
        const response = await api.post('/results', submitData);
        console.log('✅ Result created successfully:', response.data);
        toast.success('Result created successfully!');
      }
      onSuccess();
    } catch (error) {
      console.error('❌ Failed to save result:', error);
      toast.error('Failed to save result');
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = categories.map(cat => ({
    value: cat._id,
    label: cat.name
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Forced Result Type Indicator */}
      {forcedResultType && (
        <div className={`bg-${forcedResultType === 'individual' ? 'blue' : 'green'}-50 border border-${forcedResultType === 'individual' ? 'blue' : 'green'}-200 rounded-md p-4`}>
          <div className="flex items-center gap-2">
            {forcedResultType === 'individual' ? (
              <User className="w-5 h-5 text-blue-600" />
            ) : (
              <Users className="w-5 h-5 text-green-600" />
            )}
            <h3 className="text-base font-semibold text-gray-900">
              Creating {forcedResultType === 'individual' ? 'Individual' : 'Group'} Result
            </h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            This form is specifically for {forcedResultType === 'individual' ? 'individual' : 'group'} results only.
          </p>
        </div>
      )}
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <CreatableSelect
            options={categoryOptions}
            onChange={handleCategoryChange}
            value={categoryOptions.find(opt => opt.value === formData.category) || null}
            placeholder="Select or create a category..."
            formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
            classNames={{
              control: () => 'border-gray-300 shadow-sm focus:border-blue-500',
              option: () => 'hover:bg-blue-50',
            }}
            styles={{
              control: (base) => ({ ...base, minHeight: 44, borderRadius: 6 }),
              menu: (base) => ({ ...base, zIndex: 50 }),
            }}
          />
        </div>
      </div>
      {/* Result Type Selection - Only show if not forced */}
      {!forcedResultType && (
        <div className="bg-gray-50 rounded-md p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Select Result Type</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => handleResultTypeChange('individual')}
              className={`flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all duration-150 w-full sm:w-auto ${
                formData.resultType === 'individual'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50'
              }`}
            >
              <User className="w-5 h-5 mr-2" />
              Individual Results
            </button>
            <button
              type="button"
              onClick={() => handleResultTypeChange('group')}
              className={`flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all duration-150 w-full sm:w-auto ${
                formData.resultType === 'group'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50'
              }`}
            >
              <Users className="w-5 h-5 mr-2" />
              Group Results
            </button>
          </div>
        </div>
      )}
      {/* Results Section */}
      <div className="bg-white rounded-md p-4 border border-gray-100">
        <div className="flex items-center mb-4">
          {formData.resultType === 'individual' ? (
            <User className="w-6 h-6 text-blue-600 mr-2" />
          ) : (
            <Users className="w-6 h-6 text-blue-600 mr-2" />
          )}
          <h3 className="text-lg font-semibold text-gray-900">
            {formData.resultType === 'individual' ? 'Individual' : 'Group'} Results
          </h3>
        </div>

        {formData.resultType === 'individual' && formData.individual && (
          <div className="space-y-4">
            {(['first', 'second', 'third'] as const).map((position, index) => (
              <div key={position} className="bg-gray-50 rounded p-3 flex flex-col gap-2">
                <h4 className="font-medium text-gray-700 flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                  }`}>
                    {index + 1}
                  </span>
                  {position.charAt(0).toUpperCase() + position.slice(1)} Place
                </h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={formData.individual[position].name}
                    onChange={e => handleIndividualPositionChange(position, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={formData.individual[position].details}
                    onChange={e => handleIndividualPositionChange(position, 'details', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Details (optional)"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {formData.resultType === 'group' && formData.group && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-700">Group Positions</h4>
              <button
                type="button"
                onClick={addGroupPosition}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                Add Position
              </button>
            </div>

            {formData.group.positions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No group positions added yet.</p>
                <p className="text-sm">Click "Add Position" to start adding group results.</p>
                {groups.length === 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <strong>No groups available!</strong> Please create groups in the Group Manager first.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              formData.group.positions.map((position, index) => (
                <div key={index} className="bg-gray-50 rounded p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-700 flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </span>
                      Position {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeGroupPosition(index)}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Group *
                      </label>
                      <select
                        value={position.groupId}
                        onChange={e => handleGroupPositionChange(index, 'groupId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        required
                      >
                        <option value="">Select a group</option>
                        {groups.length === 0 ? (
                          <option value="" disabled>No groups available</option>
                        ) : (
                          groups.map(group => (
                            <option key={group._id} value={group._id}>
                              {group.name} ({group.totalPoints} points)
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Group Name
                      </label>
                      <input
                        type="text"
                        value={position.name}
                        onChange={e => handleGroupPositionChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50"
                        placeholder="Group name (auto-filled)"
                        readOnly
                        disabled
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Points
                      </label>
                      <input
                        type="number"
                        value={position.points}
                        onChange={async (e) => {
                          const points = parseInt(e.target.value) || 0;
                          console.log(`🎯 Points input changed for position ${index}: ${points}`);
                          console.log(`📍 Current position data:`, position);
                          
                          if (!position.groupId) {
                            console.warn('⚠️ No group selected for position', index);
                            toast.error('Please select a group first before adding points');
                            return;
                          }
                          
                          await handleGroupPositionChange(index, 'points', points);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Points"
                        min="0"
                      />
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Details
                      </label>
                      <input
                        type="text"
                        value={position.details}
                        onChange={e => handleGroupPositionChange(index, 'details', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Additional details (optional)"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-100 transition-all duration-150 w-full sm:w-auto"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-150 w-full sm:w-auto disabled:opacity-60"
        >
          {loading ? 'Saving...' : result && result._id ? 'Update Result' : 'Create Result'}
        </button>
      </div>
    </form>
  );
};

export default ResultForm;