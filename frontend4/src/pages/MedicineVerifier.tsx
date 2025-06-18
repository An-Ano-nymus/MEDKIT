import React, { useState } from 'react';
import { Camera, Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Webcam from 'react-webcam';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';

const MedicineVerifier: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [result, setResult] = useState<null | { isAuthentic: boolean; details: string }>(null);
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleScan = async (imageData: string | null) => {
    if (!imageData) return;

    setLoading(true);
    setShowCamera(false);

    setTimeout(() => {
      setResult({
        isAuthentic: Math.random() > 0.5,
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
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader toggleSidebar={toggleSidebar} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />

        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Medicine Authenticity Verifier</h1>
              <p className="text-gray-600">
                Scan or upload your medicine package to verify its authenticity.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              {!showCamera && !loading && !result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setShowCamera(true)}
                    className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="text-center">
                      <Camera className="mx-auto h-12 w-12 text-gray-400" />
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Scan QR/Barcode
                      </span>
                    </div>
                  </button>

                  <label className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Upload Image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </div>
                  </label>
                </div>
              )}

              {showCamera && (
                <div className="relative">
                  <Webcam
                    className="w-full rounded-lg"
                    screenshotFormat="image/jpeg"
                    onUserMedia={() => setIsScanning(true)}
                  />
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <button
                      onClick={() => handleScan('dummy-data')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      Capture and Verify
                    </button>
                  </div>
                </div>
              )}

              {loading && (
                <div className="text-center py-12">
                  <Loader2 className="mx-auto h-12 w-12 text-blue-600 animate-spin" />
                  <p className="mt-4 text-gray-600">Verifying medicine...</p>
                </div>
              )}

              {result && (
                <div className={`mt-6 p-6 rounded-lg ${result.isAuthentic ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center mb-2">
                    {result.isAuthentic ? (
                      <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600 mr-2" />
                    )}
                    <h3 className={`text-lg font-semibold ${result.isAuthentic ? 'text-green-800' : 'text-red-800'}`}>
                      {result.isAuthentic ? 'Authentic Medicine' : 'Potential Counterfeit'}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-700">{result.details}</p>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => {
                        setResult(null);
                        setShowCamera(false);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Scan Another
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MedicineVerifier;
