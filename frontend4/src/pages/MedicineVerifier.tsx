import React, { useState } from 'react';
import { Camera, Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Webcam from 'react-webcam';

const MedicineVerifier: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [result, setResult] = useState<null | { isAuthentic: boolean; details: string }>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async (imageData: string | null) => {
    if (!imageData) return;
    
    setLoading(true);
    setShowCamera(false);
    
    // Simulate API call to verify medicine
    setTimeout(() => {
      setResult({
        isAuthentic: Math.random() > 0.5, // Simulated result
        details: "Medicine verification complete"
      });
      setLoading(false);
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleScan(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Medicine Authenticity Verifier
            </h1>
            
            {!showCamera && !loading && !result && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Verify the authenticity of your medicine by scanning its QR code or barcode.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setShowCamera(true)}
                    className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    Scan QR Code
                  </button>
                  
                  <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>
            )}

            {showCamera && (
              <div className="relative">
                <Webcam
                  className="w-full rounded-lg"
                  onUserMedia={() => setIsScanning(true)}
                  screenshotFormat="image/jpeg"
                />
                <button
                  onClick={() => handleScan('dummy-data')}
                  className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Capture and Verify
                </button>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                <p className="mt-2 text-sm text-gray-600">Verifying medicine...</p>
              </div>
            )}

            {result && (
              <div className={`mt-4 p-4 rounded-lg ${
                result.isAuthentic ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <div className="flex items-center">
                  {result.isAuthentic ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                  <span className={`ml-2 font-medium ${
                    result.isAuthentic ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.isAuthentic ? 'Authentic Medicine' : 'Potential Counterfeit'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{result.details}</p>
                <button
                  onClick={() => {
                    setResult(null);
                    setShowCamera(false);
                  }}
                  className="mt-4 text-sm text-blue-600 hover:text-blue-800"
                >
                  Scan Another
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineVerifier;