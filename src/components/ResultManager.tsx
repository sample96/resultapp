import React, { useState } from 'react';
import { Plus, FileText, Info } from 'lucide-react';
import ResultForm from './ResultForm';

interface ResultManagerProps {}

const ResultManager: React.FC<ResultManagerProps> = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleResultCreated = () => {
    setShowForm(false);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6 animate-bounce-in">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ripple"
        >
          <Plus className="w-5 h-5 mr-2" />
          {showForm ? 'Hide Form' : 'Add New Result'}
        </button>
      </div>
      {/* Result Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-4 border border-gray-100 animate-fade-in-up">
          <div className="flex items-center mb-4">
            <FileText className="w-6 h-6 text-blue-600 mr-2 animate-bounce-in" />
            <h2 className="text-xl font-bold text-gray-900">Create New Result</h2>
          </div>
          <ResultForm onSuccess={handleResultCreated} />
        </div>
      )}
      {/* Info Message */}
      <div className="flex flex-col items-center justify-center bg-blue-50 border border-blue-100 rounded-lg p-6 mt-4 animate-fade-in-up">
        <Info className="w-8 h-8 text-blue-400 mb-2 animate-pulse-slow" />
        <p className="text-base text-blue-700 font-medium text-center">
          To view results, use the navigation bar to access <span className="font-semibold">Individual Results</span> or <span className="font-semibold">Group Results</span>.
        </p>
      </div>
    </div>
  );
};

export default ResultManager;