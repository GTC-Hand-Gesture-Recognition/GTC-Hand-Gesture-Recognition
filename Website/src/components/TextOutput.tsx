import React from 'react';
import { Download, Space, Trash2 } from 'lucide-react';

interface TextOutputProps {
  text: string;
  onAddSpace: () => void;
  onClear: () => void;
}

export const TextOutput: React.FC<TextOutputProps> = ({ text, onAddSpace, onClear }) => {
  const downloadText = () => {
    const element = document.createElement('a');
    const file = new Blob([text || 'No text to download'], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'gesture-text.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characterCount = text.length;
  
  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Recognized Text</h3>
        <div className="flex space-x-2">
          <button
            onClick={onAddSpace}
            className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            title="Add Space"
          >
            <Space className="h-4 w-4" />
            <span className="hidden sm:inline">Space</span>
          </button>
          <button
            onClick={onClear}
            className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            title="Clear All"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
          <button
            onClick={downloadText}
            className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            title="Download Text"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border-2 border-gray-200 min-h-80 p-4 mb-4">
        <div className="text-lg leading-relaxed text-gray-900 font-mono whitespace-pre-wrap">
          {text || (
            <span className="text-gray-400 italic">
              Your recognized text will appear here...
            </span>
          )}
          <span className="animate-pulse">|</span>
        </div>
      </div>
      
      <div className="flex justify-between text-sm text-gray-600">
        <div className="space-x-4">
          <span>Characters: {characterCount}</span>
          <span>Words: {wordCount}</span>
        </div>
        <div className="text-blue-600">
          Hold gestures for 2 seconds to confirm
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Quick Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click "Capture & Predict" to recognize gestures</li>
          <li>• Use "Start Building Sentence" for multiple predictions</li>
          <li>• Use the Space button to separate words</li>
          <li>• Upload images or use live camera feed</li>
        </ul>
      </div>
    </div>
  );
};