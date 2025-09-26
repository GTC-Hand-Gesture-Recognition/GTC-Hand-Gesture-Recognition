# GTC Hand Gesture Recognition

A comprehensive hand gesture recognition system built with deep learning and computer vision techniques, featuring real-time gesture detection and a user-friendly web interface.

## Description

This project implements an advanced hand gesture recognition system capable of detecting and classifying American Sign Language (ASL) alphabet gestures. The system uses a MobileNetV2-based deep learning model trained on the ASL Alphabet dataset to provide accurate real-time gesture recognition through a camera interface.

**Note:** This project was created as part of the **GTC (Genius Technology Center) training program**.

## Model Performance

Our trained model achieved excellent performance metrics:

- **Training Accuracy**: 98.76%
- **Training Loss**: 0.5376
- **Top-K Categorical Accuracy**: 99.83%
- **Validation Accuracy**: 98.29%
- **Validation Loss**: 0.5440

These metrics demonstrate the model's high accuracy in recognizing ASL alphabet gestures with minimal overfitting.

## Team Members

- Mohamed El-Bakry
- Mohamed Rabiee
- Abdallah Khalifa
- Hussien Mohamedy


## Installation Instructions

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm package manager

### Backend Setup

1. Clone the repository and navigate to the project directory
2. Navigate to the backend directory:
   ```bash
   cd Website/backend
   ```
3. Create a virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```
4. Install Python dependencies:
   ```bash
   pip install -r ../requirements.txt
   ```
5. Ensure the trained model file `best_model_final.h5` is in the project root directory

### Frontend Setup

1. Navigate to the Website directory:
   ```bash
   cd Website
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```

## How to Run the Project

### Starting the Backend Server

1. Navigate to the backend directory and activate the virtual environment:
   ```bash
   cd Website/backend
   venv\Scripts\activate
   ```
2. Start the Flask server:
   ```bash
   python app.py
   ```
   The backend server will start at `http://localhost:5000`

### Starting the Frontend Application

1. Open a new terminal and navigate to the Website directory:
   ```bash
   cd Website
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend application will start at `http://localhost:5173`

### Using the Application

1. Open your web browser and go to `http://localhost:5173`
2. Allow camera permissions when prompted
3. Position your hand in front of the camera
4. The system will detect and display the recognized gesture in real-time

## Future Improvements

- Add gesture history and logging functionality
- Implement gesture sequence recognition for words/sentences
- Add audio feedback for detected gestures
- Improve model accuracy with additional training data
- Extend to dynamic gesture recognition (sign language sentences)
- Mobile app development
- Multi-language sign language support
- Integration with accessibility tools
- Cloud deployment with scalable infrastructure
- Model optimization for edge devices

OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```


