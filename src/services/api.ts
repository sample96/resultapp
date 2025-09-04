import axios from 'axios';

// const API_BASE_URL = 'https://resultapp-backend-blxr.vercel.app/api';
const API_BASE_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use((config) => {
  console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('API Error: Request timeout');
    } else if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('API Error: No response received', error.message);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Helper function to retry failed requests
export const apiWithRetry = async (requestFn: () => Promise<any>, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`Request failed, retrying... (${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
    }
  }
};