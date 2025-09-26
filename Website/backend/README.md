# Hand Gesture Recognition Backend

This Flask backend serves your trained .h5 model for hand gesture recognition.

## Setup Instructions

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Add your trained model:**
   - Create a `model` directory in the backend folder
   - Place your trained `.h5` model file in `backend/model/gesture_model.h5`

3. **Configure the model:**
   - Update the `model_path` in `app.py` if your model has a different name
   - Adjust the `preprocess_image()` function based on your model's input requirements
   - Update the `class_labels` in `get_prediction_label()` to match your model's output classes

4. **Run the backend:**
   ```bash
   python app.py
   ```

The backend will start on `http://localhost:5000`

## API Endpoints

- `GET /health` - Check if the server and model are working
- `POST /predict` - Upload an image file for prediction
- `POST /predict_base64` - Send base64 encoded image for prediction (used for camera captures)

## Model Requirements

Your `.h5` model should:
- Accept images as input (typically 224x224 RGB)
- Output probabilities for each gesture class
- Be compatible with TensorFlow/Keras

## Customization

Adjust these functions in `app.py` based on your specific model:
- `preprocess_image()` - Image preprocessing pipeline
- `get_prediction_label()` - Class label mapping
- Model input shape and normalization requirements