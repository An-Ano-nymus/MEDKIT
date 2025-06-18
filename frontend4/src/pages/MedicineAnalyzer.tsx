import React, { useState } from 'react';
import { Upload, Search, AlertTriangle, CheckCircle, X } from 'lucide-react';

interface MedicineAnalysis {
  name: string;
  sideEffects: string[];
  interactions: string[];
  recommendation: string;
  safeToTake: boolean;
}

const MedicineAnalyzer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<MedicineAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      analyzeMedicine(file);
    }
  };
  

  const analyzeMedicine = async (file: File) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setAnalysis({
        name: "Aspirin 100mg",
        sideEffects: [
          "Stomach upset",
          "Heartburn",
          "Nausea",
          "Vomiting"
        ],
        interactions: [
          "Blood thinners",
          "Anti-inflammatory medications"
        ],
        recommendation: "Based on your medical history, this medication appears to be suitable. However, please consult with your healthcare provider before starting any new medication.",
        safeToTake: true
      });
      setLoading(false);
    }, 2000);
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Medicine Analysis
            </h1>
            
            {!selectedFile && !analysis && (
              <div className="text-center py-12">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Upload your prescription
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  We'll analyze it for side effects and interactions
                </p>
                <div className="mt-6">
                  <label className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Prescription
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-sm text-gray-600">Analyzing your medication...</p>
              </div>
            )}

            {analysis && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    Analysis Results
                  </h2>
                  <button
                    onClick={resetAnalysis}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900">{analysis.name}</h3>
                  
                  <div className="mt-4">
                    <div className="flex items-center">
                      {analysis.safeToTake ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                      <span className={`ml-2 text-sm ${
                        analysis.safeToTake ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {analysis.safeToTake ? 'Safe to take' : 'Not recommended'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900">Side Effects</h3>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    {analysis.sideEffects.map((effect, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {effect}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900">Potential Interactions</h3>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    {analysis.interactions.map((interaction, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {interaction}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-900">Recommendation</h3>
                  <p className="mt-2 text-sm text-blue-700">
                    {analysis.recommendation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineAnalyzer;