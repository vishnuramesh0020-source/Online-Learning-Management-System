import axios from 'axios';

// Base Axios instance
const axiosClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Inject auth token or custom headers if available
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.warn('API call failed, falling back to local storage cache:', error?.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
