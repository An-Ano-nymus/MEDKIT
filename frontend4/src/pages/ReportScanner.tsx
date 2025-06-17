import React, { useState, useRef } from 'react';
import { Camera, RotateCw, Upload, FileText } from 'lucide-react';
import Webcam from 'react-webcam';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import Sidebar from '../components/dashboard/Sidebar';

const ReportScanner: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<string | null>(null);
  const webcamRef = useRef<Webcam | null>(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleCapture = React.useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setIsCameraActive(false);
      // Simulate analysis
      handleAnalyzeImage(imageSrc);
    }
  }, [webcamRef]);

const handleAnalyzeImage = async (imageDataUrl: string | null) => {
  if (!imageDataUrl) return;

  setIsAnalyzing(true);
  setResults(null);

  try {
    // Convert base64 image to Blob
    const blob = await (await fetch(imageDataUrl)).blob();
    const formData = new FormData();
    formData.append('file', blob, 'report.jpg');

    const response = await fetch('http://localhost:5000/analyze', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to analyze the report');
    }

    // Streaming output (if supported by backend)
    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8');
    let resultText = '';

    while (reader) {
      const { value, done } = await reader.read();
      if (done) break;
      resultText += decoder.decode(value);
      setResults(prev => (prev ?? '') + decoder.decode(value));
    }

    setIsAnalyzing(false);
  } catch (error) {
    console.error('❌ Error analyzing image:', error);
    setResults('Failed to analyze the report.');
    setIsAnalyzing(false);
  }
};


const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    setCapturedImage(URL.createObjectURL(file));
    handleAnalyzeFile(file);
  }
};

const handleAnalyzeFile = async (file: File) => {
  setIsAnalyzing(true);
  setResults(null);

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('http://localhost:5000/analyze', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to analyze the report');
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8');
    let resultText = '';

    while (reader) {
      const { value, done } = await reader.read();
      if (done) break;
      resultText += decoder.decode(value);
      setResults(prev => (prev ?? '') + decoder.decode(value));
    }

    setIsAnalyzing(false);
  } catch (error) {
    console.error('❌ Error analyzing file:', error);
    setResults('Failed to analyze the report.');
    setIsAnalyzing(false);
  }
};


  const resetScan = () => {
    setCapturedImage(null);
    setResults(null);
    setIsCameraActive(false);
  };

  const handleDownload = () => {
  if (!results) return;

  const blob = new Blob([results], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'medical_report_analysis.pdf';
  a.click();

  URL.revokeObjectURL(url); // cleanup
};


  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader toggleSidebar={toggleSidebar} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
        
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Medical Report Scanner</h1>
              <p className="text-gray-600">Scan your medical reports for instant analysis</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              {!isCameraActive && !capturedImage && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setIsCameraActive(true)}
                      className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <div className="text-center">
                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Use Camera
                        </span>
                      </div>
                    </button>

                    <label className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload Report
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileUpload}
                        />
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {isCameraActive && (
                <div className="relative">
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full rounded-lg"
                  />
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <button
                      onClick={handleCapture}
                      className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      Capture
                    </button>
                  </div>
                </div>
              )}

              {capturedImage && (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={capturedImage}
                      alt="Captured report"
                      className="w-full rounded-lg"
                    />
                    <button
                      onClick={resetScan}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                    >
                      <RotateCw className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  {isAnalyzing ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-4 text-gray-600">Analyzing your report...</p>
                    </div>
                  ) : results && (
                    <div className="mt-6 bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-center mb-4">
                        <FileText className="h-6 w-6 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Analysis Results</h3>
                      </div>
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono bg-white p-4 rounded-md border border-gray-200">
                        {results}
                      </pre>
                      <div className="mt-4 flex justify-end">
                        <button
  onClick={handleDownload}
  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
>
  Download Report
</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportScanner;