import axios from 'axios';

// Base Axios instance
const axiosClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor with styled DevTools console logging
axiosClient.interceptors.request.use(
  (config) => {
    const method = config.method ? config.method.toUpperCase() : 'GET';
    const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
    console.log(
      `%c📡 [Third-Party API Request] %c${method} %c${fullUrl}`,
      'color: #4f46e5; font-weight: bold;',
      'color: #059669; font-weight: bold;',
      'color: #334155;'
    );
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with DevTools logging
axiosClient.interceptors.response.use(
  (response) => {
    const method = response.config?.method ? response.config.method.toUpperCase() : 'GET';
    console.log(
      `%c✅ [Third-Party API Response] %c${method} %c${response.config?.url || ''} %c(Status ${response.status})`,
      'color: #059669; font-weight: bold;',
      'color: #4f46e5; font-weight: bold;',
      'color: #334155;',
      'color: #64748b;'
    );
    return response.data;
  },
  (error) => {
    console.warn(
      `%c⚠️ [Third-Party API Warning] %c${error?.config?.url || 'Request'} failed: ${error?.message}. Falling back to local storage cache.`,
      'color: #d97706; font-weight: bold;',
      'color: #dc2626;'
    );
    return Promise.reject(error);
  }
);

export default axiosClient;
