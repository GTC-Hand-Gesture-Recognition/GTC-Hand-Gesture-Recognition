# GTC Hand Gesture Recognition

A comprehensive hand gesture recognition system built with deep learning and computer vision techniques, featuring real-time gesture detection and a user-friendly web interface.

## 📖 Project Description

This project implements an advanced hand gesture recognition system capable of detecting and classifying American Sign Language (ASL) alphabet gestures. The system uses a MobileNetV2-based deep learning model trained on the ASL Alphabet dataset to provide accurate real-time gesture recognition through a camera interface.

### Key Features

- **Real-time gesture detection** using webcam input
- **High accuracy ASL alphabet recognition** (A-Z + additional gestures)
- **Modern web interface** built with React and TypeScript
- **RESTful API backend** powered by Flask
- **Mobile-optimized design** with responsive UI
- **Jupyter notebook documentation** for model training and analysis

---


## 👥 Team Members

- *Mohamed El-Bakry*
- *Mohamed Rabiee*
- *Hussien Mohamedy*
- *Abdallah*

---

## 🚀 Installation Instructions

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn package manager
- Git

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GTC-Hand-Gesture-Recognition/GTC-Hand-Gesture-Recognition
   cd GTC-Hand-Gesture-Recognition
   ```

2. **Navigate to the backend directory:**
   ```bash
   cd Website/backend
   ```

3. **Create a virtual environment:**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

4. **Install Python dependencies:**
   ```bash
   pip install -r ../requirements.txt
   ```

5. **Create model directory and add your trained model:**
   ```bash
   mkdir model
   # Place your gesture_model.h5 file in the model directory
   ```

### Frontend Setup

1. **Navigate to the Website directory:**
   ```bash
   cd Website
   ```

2. **Install npm dependencies:**
   ```bash
   npm install
   ```

---

## 🏃‍♂️ How to Run the Project

### Starting the Backend Server

1. **Navigate to the backend directory:**
   ```bash
   cd Website/backend
   ```

2. **Activate the virtual environment:**
   ```bash
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Start the Flask server:**
   ```bash
   python app.py
   ```
   
   The backend server will start at `http://localhost:5000`

### Starting the Frontend Application

1. **Open a new terminal and navigate to the Website directory:**
   ```bash
   cd Website
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The frontend application will start at `http://localhost:5173`

### Using the Application

1. Open your web browser and go to `http://localhost:5173`
2. Allow camera permissions when prompted
3. Position your hand in front of the camera
4. The system will detect and display the recognized gesture in real-time
5. View the confidence score and prediction results

---

## 📊 Model Training

The machine learning model was trained using:

- **Dataset:** ASL Alphabet Dataset from Kaggle (87,000 images, 29 classes)
- **Architecture:** MobileNetV2 with custom classification layers
- **Training Strategy:** Transfer learning with fine-tuning
- **Data Augmentation:** Rotation, zoom, contrast, and brightness adjustments
- **Performance:** High accuracy on test set with robust real-time inference

For detailed model training process, refer to the Jupyter notebooks:
- `Hand_Gesture_GTC.ipynb` - Main training pipeline
- `Crop_hands.ipynb` - Data preprocessing and hand cropping

---

## 🛠 Technology Stack

### Machine Learning & AI
- TensorFlow/Keras
- MobileNetV2 (Transfer Learning)
- OpenCV for image processing
- NumPy and Pandas for data handling

### Backend
- Flask (Python web framework)
- Flask-CORS for cross-origin requests
- PIL (Python Imaging Library)

### Frontend
- React 18 with TypeScript
- Vite (build tool)
- Tailwind CSS for styling
- Axios for API communication
- Lucide React for icons

### Development Tools
- ESLint for code quality
- Jupyter Notebooks for experimentation
- Git for version control

---

## 🔮 Future Improvements

### Short-term Goals
- [ ] Add gesture history and logging functionality
- [ ] Implement gesture sequence recognition for words
- [ ] Add audio feedback for detected gestures
- [ ] Improve model accuracy with additional training data
- [ ] Add user authentication and personalized settings

### Long-term Vision
- [ ] Extend to dynamic gesture recognition (sign language sentences)
- [ ] Mobile app development (React Native/Flutter)
- [ ] Multi-language sign language support
- [ ] Integration with accessibility tools
- [ ] Real-time translation between sign languages
- [ ] Cloud deployment with scalable infrastructure
- [ ] API rate limiting and user management
- [ ] Advanced analytics and usage insights

### Technical Enhancements
- [ ] Model optimization for edge devices
- [ ] WebRTC integration for better camera handling
- [ ] Progressive Web App (PWA) features
- [ ] Docker containerization
- [ ] Automated testing and CI/CD pipeline

---

## 📁 Project Structure

```
GTC-Hand-Gesture-Recognition/
├── README.md
├── Hand_Gesture_GTC.ipynb          # Main training notebook
├── Crop_hands.ipynb                # Data preprocessing notebook
└── Website/
    ├── package.json                # Frontend dependencies
    ├── requirements.txt            # Python dependencies
    ├── backend/
    │   ├── app.py                 # Flask API server
    │   ├── model/                 # Trained model directory
    │   └── README.md              # Backend documentation
    └── src/
        ├── components/            # React components
        ├── pages/                # Application pages
        └── services/             # API services
```

---

## 🤝 Contributing

We welcome contributions to improve this project! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 GTC Hand Gesture Recognition Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
