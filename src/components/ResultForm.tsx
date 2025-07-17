import React, { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import { Calendar, Trophy, Users, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';

interface Category {
  _id: string;
  name: string;
  description?: string;
}

interface Position {
  name: string;
  details: string;
}

type ResultType = 'individual' | 'group';

interface ResultFormData {
  category: string;
  eventName: string;
  eventDate: string;
  resultType: ResultType;
  positions: {
    first: Position;
    second: Position;
    third: Position;
  };
}

interface ResultFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
  result?: any; // For edit mode
}

const ResultForm: React.FC<ResultFormProps> = ({ onSuccess, onCancel, result }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ResultFormData>({
    category: '',
    eventName: '',
    eventDate: '',
    resultType: 'individual',
    positions: {
      first: { name: '', details: '' },
      second: { name: '', details: '' },
      third: { name: '', details: '' }
    }
  });

  useEffect(() => {
    fetchCategories();
    if (result) {
      // Pre-fill form for edit
      setFormData({
        category: result.category?._id || '',
        eventName: result.eventName || '',
        eventDate: result.eventDate ? result.eventDate.slice(0, 10) : '',
        resultType: result.individual && (result.individual.first?.name || result.individual.second?.name || result.individual.third?.name)
          ? 'individual'
          : 'group',
        positions: result.individual && (result.individual.first?.name || result.individual.second?.name || result.individual.third?.name)
          ? result.individual
          : result.group || {
              first: { name: '', details: '' },
              second: { name: '', details: '' },
              third: { name: '', details: '' }
            }
      });
    }
  }, [result]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
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
      positions: {
        first: { name: '', details: '' },
        second: { name: '', details: '' },
        third: { name: '', details: '' }
      }
    }));
  };

  const handlePositionChange = (position: 'first' | 'second' | 'third', field: 'name' | 'details', value: string) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.eventName || !formData.eventDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    // Helper to strip _id from positions
    const stripIds = (positions: any) => {
      if (!positions) return positions;
      const clean = {} as any;
      ['first', 'second', 'third'].forEach(pos => {
        if (positions[pos]) {
          const { _id, ...rest } = positions[pos];
          clean[pos] = rest;
        } else {
          clean[pos] = { name: '', details: '' };
        }
      });
      return clean;
    };
    const submitData = {
      category: formData.category,
      eventName: formData.eventName,
      eventDate: formData.eventDate,
      individual: formData.resultType === 'individual' ? stripIds(formData.positions) : null,
      group: formData.resultType === 'group' ? stripIds(formData.positions) : null,
    };
    setLoading(true);
    try {
      if (result && result._id) {
        await api.put(`/results/${result._id}`, submitData);
        toast.success('Result updated successfully!');
      } else {
        await api.post('/results', submitData);
        toast.success('Result created successfully!');
      }
      onSuccess();
    } catch (error) {
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Name *
          </label>
          <div className="relative">
            <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={formData.eventName}
              onChange={(e) => handleInputChange('eventName', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Enter event name"
              required
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Date *
          </label>
          <div className="relative max-w-md">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={formData.eventDate}
              onChange={(e) => handleInputChange('eventDate', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              required
            />
          </div>
        </div>
      </div>
      {/* Result Type Selection */}
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
                  value={formData.positions[position].name}
                  onChange={e => handlePositionChange(position, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={formData.positions[position].details}
                  onChange={e => handlePositionChange(position, 'details', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Details (optional)"
                />
              </div>
            </div>
          ))}
        </div>
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