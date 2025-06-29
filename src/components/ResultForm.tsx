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
}

const ResultForm: React.FC<ResultFormProps> = ({ onSuccess }) => {
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
  }, []);

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

    // Transform data to match the original API structure
    const submitData = {
      category: formData.category,
      eventName: formData.eventName,
      eventDate: formData.eventDate,
      // individual: formData.resultType === 'individual' ? formData.positions : {
      //   first: { name: '', details: '' },
      //   second: { name: '', details: '' },
      //   third: { name: '', details: '' }
      // },
      // group: formData.resultType === 'group' ? formData.positions : {
      //   first: { name: '', details: '' },
      //   second: { name: '', details: '' },
      //   third: { name: '', details: '' }
      // }
      individual: formData.resultType === 'individual' ? formData.positions : null,
    group: formData.resultType === 'group' ? formData.positions : null,
    };

    setLoading(true);
    try {
      await api.post('/results', submitData);
      toast.success('Result created successfully!');
      onSuccess();
    } catch (error) {
      toast.error('Failed to create result');
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = categories.map(cat => ({
    value: cat._id,
    label: cat.name
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category *
          </label>
          <CreatableSelect
            options={categoryOptions}
            onChange={handleCategoryChange}
            placeholder="Select or create a category..."
            formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
            classNames={{
              control: () => 'border-gray-300 shadow-sm hover:border-gray-400 focus:border-blue-500',
              option: () => 'hover:bg-blue-50',
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Event Name *
          </label>
          <div className="relative">
            <Trophy className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={formData.eventName}
              onChange={(e) => handleInputChange('eventName', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter event name"
              required
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Event Date *
          </label>
          <div className="relative max-w-md">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={formData.eventDate}
              onChange={(e) => handleInputChange('eventDate', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
        </div>
      </div>

      {/* Result Type Selection */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Result Type</h3>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => handleResultTypeChange('individual')}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              formData.resultType === 'individual'
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50'
            }`}
          >
            <User className="w-5 h-5 mr-2" />
            Individual Results
          </button>
          <button
            type="button"
            onClick={() => handleResultTypeChange('group')}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              formData.resultType === 'group'
                ? 'bg-green-600 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-green-50'
            }`}
          >
            <Users className="w-5 h-5 mr-2" />
            Group Results
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className={`${
        formData.resultType === 'individual' ? 'bg-blue-50' : 'bg-green-50'
      } rounded-xl p-6`}>
        <div className="flex items-center mb-6">
          {formData.resultType === 'individual' ? (
            <User className="w-6 h-6 text-blue-600 mr-3" />
          ) : (
            <Users className="w-6 h-6 text-green-600 mr-3" />
          )}
          <h3 className="text-xl font-semibold text-gray-900">
            {formData.resultType === 'individual' ? 'Individual' : 'Group'} Results
          </h3>
        </div>
        
        <div className="space-y-6">
          {(['first', 'second', 'third'] as const).map((position, index) => (
            <div key={position} className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-2 ${
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                }`}>
                  {index + 1}
                </span>
                {position.charAt(0).toUpperCase() + position.slice(1)} Place
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={formData.positions[position].name}
                  onChange={(e) => handlePositionChange(position, 'name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={formData.resultType === 'individual' ? 'Participant name' : 'Group/Team name'}
                />
                <input
                  type="text"
                  value={formData.positions[position].details}
                  onChange={(e) => handlePositionChange(position, 'details', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Additional details (optional)"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none"
        >
          {loading ? 'Creating...' : `Create ${formData.resultType === 'individual' ? 'Individual' : 'Group'} Result`}
        </button>
      </div>
    </form>
  );
};

export default ResultForm;