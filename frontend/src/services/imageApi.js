import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/image';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  // Do NOT manually set Content-Type header so browser sets multipart boundary automatically
  const response = await api.post('/upload', formData);
  return response.data;
};

export const analyzeImage = async (query, ocrText = '', platform = 'Unknown') => {
  const response = await api.post('/analyze', null, {
    params: {
      query: query,
      ocr_text: ocrText,
      platform: platform
    }
  });
  return response.data;
};

export const uploadMultipleImages = async (files) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  const response = await api.post('/upload-multiple', formData);
  return response.data;
};

export const getImageStatus = async (jobId) => {
  const response = await api.get(`/status/${jobId}`);
  return response.data;
};

export default {
  uploadImage,
  analyzeImage,
  uploadMultipleImages,
  getImageStatus,
};
