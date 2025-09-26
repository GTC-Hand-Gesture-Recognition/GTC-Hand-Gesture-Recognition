import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export interface PredictionResponse {
  success: boolean;
  prediction?: string;
  confidence?: number;
  message?: string;
  error?: string;
}

export const apiService = {
  // Check if backend is healthy
  async checkHealth(): Promise<{ status: string; model_loaded: boolean }> {
    const response = await api.get('/health');
    return response.data;
  },

  // Upload image file for prediction
  async predictFromFile(file: File): Promise<PredictionResponse> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Send base64 image for prediction (camera captures)
  async predictFromBase64(base64Image: string): Promise<PredictionResponse> {
    const response = await api.post('/predict_base64', {
      image: base64Image,
    });

    return response.data;
  },
};