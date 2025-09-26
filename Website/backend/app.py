import os
import io
import numpy as np
from PIL import Image
import cv2
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64

app = Flask(__name__)
CORS(app)

# Global variable to store the loaded model
model = None

# Define custom MobileNetPreprocess layer (MUST match training exactly)
class MobileNetPreprocess(tf.keras.layers.Layer):
    def __init__(self, **kwargs):
        super(MobileNetPreprocess, self).__init__(**kwargs)
    
    def call(self, inputs):
        # CRITICAL: This MUST match your training code exactly
        # Your training code: tf.keras.applications.mobilenet_v2.preprocess_input(inputs * 255.0)
        return tf.keras.applications.mobilenet_v2.preprocess_input(inputs * 255.0)
    
    def get_config(self):
        return super(MobileNetPreprocess, self).get_config()

def load_model():
    """Load the trained .h5 model"""
    global model
    try:
        # Model options - uncomment the one you want to use:
        model_path = 'model/gesture_model.h5'        # Original model
        # model_path = 'model/best_model_stage1.h5'  # Stage 1 fine-tuned
        # model_path = 'model/best_model_stage2.h5'  # Stage 2 fine-tuned
        # model_path = 'model/custom_model.h5'       # Custom model
      
        
        if os.path.exists(model_path):
            # Create custom objects for loading
            custom_objects = {
                'MobileNetPreprocess': MobileNetPreprocess,
                'mobile_net_preprocess': MobileNetPreprocess,  # try lowercase too
            }
            
            # Load model with custom objects
            model = tf.keras.models.load_model(
                model_path, 
                custom_objects=custom_objects,
                compile=False,
                safe_mode=False
            )
            print(f"Model loaded successfully from {model_path}")
            print(f"Model input shape: {model.input_shape}")
            print(f"Model output shape: {model.output_shape}")
            
            # Compile the model if it wasn't compiled during loading
            if not hasattr(model, 'compiled_loss') or model.compiled_loss is None:
                model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
                print("Model compiled successfully")
                
        else:
            print(f"Model file not found at {model_path}")
            print("Please place your .h5 model file in the 'model' directory")
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        print("Model loading failed. Server will continue without model.")

def preprocess_image(image):
    """
    Preprocess the image for model prediction
    MUST match the preprocessing used during training
    """
    try:
        # Convert PIL image to numpy array
        img_array = np.array(image)
        
        # Convert to RGB if needed
        if len(img_array.shape) == 3 and img_array.shape[2] == 4:
            img_array = cv2.cvtColor(img_array, cv2.COLOR_RGBA2RGB)
        elif len(img_array.shape) == 3 and img_array.shape[2] == 3:
            # Ensure RGB format (PIL gives RGB, OpenCV gives BGR)
            pass  # PIL already gives RGB
        
        # Resize image to 224x224 (IMG_SIZE from training)
        img_resized = cv2.resize(img_array, (224, 224))
        
        # Convert to float32 and normalize to [0, 1]
        # This matches the input expected by your MobileNetPreprocess layer
        img_normalized = img_resized.astype(np.float32) / 255.0
        
        # Add batch dimension
        img_batch = np.expand_dims(img_normalized, axis=0)
        
        print(f"Preprocessed image shape: {img_batch.shape}, range: [{img_batch.min():.3f}, {img_batch.max():.3f}]")
        
        return img_batch
    except Exception as e:
        print(f"Error preprocessing image: {str(e)}")
        return None

def get_prediction_label(prediction_array):
    """
    Convert model prediction to character label
    Adjust this based on your model's output format
    """
    # Model outputs 29 classes - likely 26 letters + 3 additional (maybe space, delete, nothing)
    # You may need to adjust these labels based on your actual training data
    class_labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
                   'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
                   'U', 'V', 'W', 'X', 'Y', 'Z', 'SPACE', 'DELETE', 'NOTHING']
    
    predicted_index = np.argmax(prediction_array)
    confidence = float(np.max(prediction_array))
    
    if predicted_index < len(class_labels):
        predicted_label = class_labels[predicted_index]
    else:
        predicted_label = 'Unknown'
    
    return predicted_label, confidence

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict gesture from uploaded image
    Expects: multipart/form-data with 'image' file
    Returns: JSON with prediction and confidence
    """
    try:
        if model is None:
            return jsonify({
                'error': 'Model not loaded. Please check server logs.',
                'success': False
            }), 500
        
        # Check if image file is present
        if 'image' not in request.files:
            return jsonify({
                'error': 'No image file provided',
                'success': False
            }), 400
        
        file = request.files['image']
        
        if file.filename == '':
            return jsonify({
                'error': 'No image file selected',
                'success': False
            }), 400
        
        # Read and process the image
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        # Preprocess the image
        processed_image = preprocess_image(image)
        
        if processed_image is None:
            return jsonify({
                'error': 'Failed to preprocess image',
                'success': False
            }), 400
        
        # Make prediction
        prediction = model.predict(processed_image)
        predicted_label, confidence = get_prediction_label(prediction[0])
        
        return jsonify({
            'success': True,
            'prediction': predicted_label,
            'confidence': confidence,
            'message': f'Predicted gesture: {predicted_label} (confidence: {confidence:.2f})'
        })
        
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return jsonify({
            'error': f'Prediction failed: {str(e)}',
            'success': False
        }), 500

@app.route('/predict_base64', methods=['POST'])
def predict_base64():
    """
    Predict gesture from base64 encoded image (for camera captures)
    Expects: JSON with 'image' field containing base64 string
    Returns: JSON with prediction and confidence
    """
    try:
        if model is None:
            return jsonify({
                'error': 'Model not loaded. Please check server logs.',
                'success': False
            }), 500
        
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({
                'error': 'No image data provided',
                'success': False
            }), 400
        
        # Decode base64 image
        image_data = data['image']
        
        # Remove data URL prefix if present
        if image_data.startswith('data:image'):
            image_data = image_data.split(',')[1]
        
        # Decode base64
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Preprocess the image
        processed_image = preprocess_image(image)
        
        if processed_image is None:
            return jsonify({
                'error': 'Failed to preprocess image',
                'success': False
            }), 400
        
        # Make prediction
        prediction = model.predict(processed_image)
        predicted_label, confidence = get_prediction_label(prediction[0])
        
        return jsonify({
            'success': True,
            'prediction': predicted_label,
            'confidence': confidence,
            'message': f'Predicted gesture: {predicted_label} (confidence: {confidence:.2f})'
        })
        
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return jsonify({
            'error': f'Prediction failed: {str(e)}',
            'success': False
        }), 500

if __name__ == '__main__':
    # Create model directory if it doesn't exist
    os.makedirs('model', exist_ok=True)
    
    # Load the model on startup
    load_model()
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)
