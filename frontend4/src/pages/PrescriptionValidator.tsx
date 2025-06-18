import React from 'react';
import { Camera, Upload, CheckCircle } from 'lucide-react';

const PrescriptionValidator: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Prescription Validator</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <Upload className="w-12 h-12 text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-700">Upload Prescription</p>
                <p className="text-sm text-gray-500">Drag and drop your prescription here or click to browse</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Choose File
              </button>
            </div>
          </div>

          {/* Camera Section */}
          <div className="text-center">
            <p className="text-gray-500 mb-4">- OR -</p>
            <button className="flex items-center justify-center space-x-2 mx-auto px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors">
              <Camera className="w-5 h-5" />
              <span>Take Photo</span>
            </button>
          </div>

          {/* Validation Results Section */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Validation Results</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>Prescription format is valid</span>
              </div>
              <div className="flex items-center space-x-3 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>Doctor's signature verified</span>
              </div>
              <div className="flex items-center space-x-3 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>Medications listed are legitimate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionValidator;