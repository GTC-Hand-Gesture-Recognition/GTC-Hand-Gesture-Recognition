import React from 'react';
import { GestureDetector } from '../components/GestureDetector';
import { TextOutput } from '../components/TextOutput';

export const HomePage: React.FC = () => {
  const [detectedText, setDetectedText] = React.useState('');
  
  const handleGestureDetected = (gesture: string) => {
    setDetectedText(prev => prev + gesture);
  };
  
  const handleAddSpace = () => {
    setDetectedText(prev => prev + ' ');
  };
  
  const handleClear = () => {
    setDetectedText('');
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Hand Gesture to Text Converter
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Use your webcam to convert hand gestures into text in real-time. 
          Hold each gesture steady for accurate recognition.
        </p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <GestureDetector onGestureDetected={handleGestureDetected} />
        <TextOutput
          text={detectedText}
          onAddSpace={handleAddSpace}
          onClear={handleClear}
        />
      </div>
    </div>
  );
};