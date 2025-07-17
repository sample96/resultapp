import React, { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import ResultForm from './ResultForm';
import ResultList from './ResultList';

interface ResultManagerProps {}

const ResultManager: React.FC<ResultManagerProps> = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleResultCreated = () => {
    setShowForm(false);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          <Plus className="w-5 h-5 mr-2" />
          {showForm ? 'Hide Form' : 'Add New Result'}
        </button>
      </div>
      {/* Result Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
          <div className="flex items-center mb-4">
            <FileText className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Create New Result</h2>
          </div>
          <ResultForm onSuccess={handleResultCreated} />
        </div>
      )}
      {/* Results List */}
      <ResultList key={refreshTrigger} />
    </div>
  );
};

export default ResultManager;