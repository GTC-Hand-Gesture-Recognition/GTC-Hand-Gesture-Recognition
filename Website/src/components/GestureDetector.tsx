import React, { useRef, useEffect, useState } from 'react';
import { Camera, Upload, AlertCircle, Wifi, WifiOff, Play, Square } from 'lucide-react';
import { apiService } from '../services/api';

interface GestureDetectorProps {
  onGestureDetected: (gesture: string) => void;
}

export const GestureDetector: React.FC<GestureDetectorProps> = ({ onGestureDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [error, setError] = useState<string>('');
  const [currentGesture, setCurrentGesture] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [predictionHistory, setPredictionHistory] = useState<string[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isAutoCapture, setIsAutoCapture] = useState(false); // New state for auto capture
  const [captureInterval, setCaptureInterval] = useState<number>(1000); // Capture every 1 second
  
  // Ref for the auto capture interval
  const autoCaptureIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Check backend connection on component mount
  useEffect(() => {
    checkBackendConnection();
  }, []);
  
  // Auto-capture effect
  useEffect(() => {
    if (isAutoCapture && isStreamActive && backendStatus === 'connected') {
      // Start auto-capture interval
      autoCaptureIntervalRef.current = setInterval(() => {
        if (!isProcessing) { // Only capture if not currently processing
          const imageData = captureImageFromVideo();
          if (imageData) {
            handlePrediction(imageData);
          }
        }
      }, captureInterval);
    } else {
      // Clear interval if auto-capture is disabled
      if (autoCaptureIntervalRef.current) {
        clearInterval(autoCaptureIntervalRef.current);
        autoCaptureIntervalRef.current = null;
      }
    }
    
    // Cleanup on component unmount or dependency change
    return () => {
      if (autoCaptureIntervalRef.current) {
        clearInterval(autoCaptureIntervalRef.current);
        autoCaptureIntervalRef.current = null;
      }
    };
  }, [isAutoCapture, isStreamActive, backendStatus, isProcessing, captureInterval]);
  
  const checkBackendConnection = async () => {
    try {
      setBackendStatus('checking');
      await apiService.checkHealth();
      setBackendStatus('connected');
    } catch (error) {
      setBackendStatus('disconnected');
      setError('Backend server not available. Please start the Flask backend.');
    }
  };
  
  const captureImageFromVideo = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0);
    
    // Convert to base64
    return canvas.toDataURL('image/jpeg', 0.8);
  };
  
  const handlePrediction = async (imageData: string | File) => {
    if (backendStatus !== 'connected') {
      setError('Backend not connected. Please check the server.');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      let response;
      
      if (typeof imageData === 'string') {
        // Base64 image from camera
        response = await apiService.predictFromBase64(imageData);
      } else {
        // File upload
        response = await apiService.predictFromFile(imageData);
      }
      
      if (response.success && response.prediction) {
        if (isBuilding) {
          // Add to prediction history
          setPredictionHistory(prev => [...prev, response.prediction!]);
        } else {
          // Single prediction
          onGestureDetected(response.prediction);
        }
        setCurrentGesture(response.prediction);
      } else {
        setError(response.error || 'Prediction failed');
      }
    } catch (error) {
      setError('Failed to get prediction from server');
      console.error('Prediction error:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const captureFromCamera = () => {
    if (!isStreamActive) {
      setError('Please start the camera first');
      return;
    }
    
    const imageData = captureImageFromVideo();
    if (imageData) {
      handlePrediction(imageData);
    } else {
      setError('Failed to capture image from camera');
    }
  };
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreamActive(true);
        setError('');
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions or use image upload.');
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreamActive(false);
    setIsAutoCapture(false); // Stop auto-capture when camera is stopped
    
    // Clear any running intervals
    if (autoCaptureIntervalRef.current) {
      clearInterval(autoCaptureIntervalRef.current);
      autoCaptureIntervalRef.current = null;
    }
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handlePrediction(file);
    }
  };
  
  const startBuilding = () => {
    setIsBuilding(true);
    setPredictionHistory([]);
  };
  
  const finishBuilding = () => {
    if (predictionHistory.length > 0) {
      const sentence = predictionHistory.join('');
      onGestureDetected(sentence);
      setPredictionHistory([]);
    }
    setIsBuilding(false);
  };
  
  const cancelBuilding = () => {
    setIsBuilding(false);
    setPredictionHistory([]);
  };
  
  const toggleAutoCapture = () => {
    setIsAutoCapture(!isAutoCapture);
  };
  
  const handleCaptureIntervalChange = (newInterval: number) => {
    setCaptureInterval(newInterval);
  };
  
  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Camera Feed</h3>
        <div className="flex space-x-2">
          {/* Backend Status Indicator */}
          <div className="flex items-center space-x-1 px-2 py-1 rounded-lg text-xs">
            {backendStatus === 'connected' ? (
              <>
                <Wifi className="h-3 w-3 text-green-600" />
                <span className="text-green-600">Connected</span>
              </>
            ) : backendStatus === 'disconnected' ? (
              <>
                <WifiOff className="h-3 w-3 text-red-600" />
                <span className="text-red-600">Disconnected</span>
              </>
            ) : (
              <span className="text-yellow-600">Checking...</span>
            )}
          </div>
          
          {!isStreamActive ? (
            <button
              onClick={startCamera}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Camera className="h-4 w-4" />
              <span>Start Camera</span>
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Camera className="h-4 w-4" />
              <span>Stop Camera</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="relative">
        {/* Video Feed */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`w-full h-80 bg-gray-200 rounded-lg object-cover ${
            !isStreamActive ? 'hidden' : ''
          }`}
          onLoadedMetadata={() => videoRef.current?.play()}
        />
        
        {/* Placeholder when camera is off */}
        {!isStreamActive && (
          <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Camera feed will appear here</p>
            </div>
          </div>
        )}
        
        {/* Processing Status Overlay */}
        {isProcessing ? (
          <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-2 rounded-lg">
            <span>Processing...</span>
          </div>
        ) : currentGesture && (
          <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-2 rounded-lg">
            <span>Last: {currentGesture}</span>
          </div>
        )}
        
        {/* Auto-capture Status */}
        {isAutoCapture && (
          <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-2 rounded-lg">
            <span>Auto-capturing every {captureInterval / 1000}s</span>
          </div>
        )}
        
        {/* Building Mode Status */}
        {isBuilding && (
          <div className="absolute bottom-4 right-4 bg-purple-600 text-white px-3 py-2 rounded-lg">
            <span>Building: {predictionHistory.join('')}</span>
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}
      
      {/* Prediction Controls */}
      <div className="mt-4 space-y-4">
        {/* Auto-capture Controls */}
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Auto-Capture Settings</h4>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleAutoCapture}
              disabled={!isStreamActive || backendStatus !== 'connected'}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isAutoCapture
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              } disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
              {isAutoCapture ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isAutoCapture ? 'Stop Auto-Capture' : 'Start Auto-Capture'}</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Interval:</label>
              <select
                value={captureInterval}
                onChange={(e) => handleCaptureIntervalChange(Number(e.target.value))}
                disabled={isAutoCapture}
                className="px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
              >
                <option value={500}>0.5s</option>
                <option value={1000}>1s</option>
                <option value={2000}>2s</option>
                <option value={3000}>3s</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Manual Camera Capture */}
        <div className="flex space-x-2">
          <button
            onClick={captureFromCamera}
            disabled={!isStreamActive || isProcessing || backendStatus !== 'connected' || isAutoCapture}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Camera className="h-4 w-4" />
            <span>{isAutoCapture ? 'Auto-Capture Active' : 'Manual Capture'}</span>
          </button>
          
          <button
            onClick={checkBackendConnection}
            className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            title="Check Backend Connection"
          >
            <Wifi className="h-4 w-4" />
          </button>
        </div>
        
        {/* Building Mode Controls */}
        <div className="flex space-x-2">
          {!isBuilding ? (
            <button
              onClick={startBuilding}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Start Building Sentence
            </button>
          ) : (
            <>
              <button
                onClick={finishBuilding}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Finish ({predictionHistory.length} chars)
              </button>
              <button
                onClick={cancelBuilding}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Image Upload */}
      <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Upload an image for prediction
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing || backendStatus !== 'connected'}
            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? 'Processing...' : 'Choose Image'}
          </button>
        </div>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
