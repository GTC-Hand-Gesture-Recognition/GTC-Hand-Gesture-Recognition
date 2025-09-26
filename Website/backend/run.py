#!/usr/bin/env python3
"""
Simple script to run the Flask backend server
"""

import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app

if __name__ == '__main__':
    print("Starting Hand Gesture Recognition Backend...")
    print("Make sure your .h5 model is placed in backend/model/gesture_model.h5")
    print("Backend will be available at: http://localhost:5000")
    print("Frontend should be running at: http://localhost:5173")
    print("-" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5000)