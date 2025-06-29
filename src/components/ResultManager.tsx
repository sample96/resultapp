import React, { useState } from 'react';
import { Plus, FileText, Download } from 'lucide-react';
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
    <div className="space-y-8">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="w-5 h-5 mr-2" />
          {showForm ? 'Hide Form' : 'Add New Result'}
        </button>
      </div>

      {/* Result Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center mb-6">
            <FileText className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Create New Result</h2>
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