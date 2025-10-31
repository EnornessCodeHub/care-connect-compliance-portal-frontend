/**
 * Axios Configuration
 * Centralized axios instance with interceptors for authentication and error handling
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import authService from '@/services/authService';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add authentication token to all requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authService.getToken();
    
    if (token && config.headers) {
      config.headers['x-access-token'] = token;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    // Return the data directly for successful responses
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized - Automatic logout
    if (error.response?.status === 401) {
      // Clear authentication data
      authService.logout();
      
      // Redirect to login page
      window.location.href = '/login';
      
      // Return a rejected promise with a clear message
      return Promise.reject(new Error('Session expired. Please login again.'));
    }

    // Handle other HTTP errors
    if (error.response) {
      // Server responded with error status
      const message = (error.response.data as any)?.message || error.message;
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject(new Error('No response from server. Please check your connection.'));
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  }
);

export default api;

