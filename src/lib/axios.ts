/**
 * Axios Configuration
 * Centralized axios instance with interceptors for authentication and error handling
 */

import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import authService from '@/services/authService';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 60000, // 60 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request queue to prevent duplicate requests
interface PendingRequest {
  url: string;
  method: string;
  cancel: () => void;
  timestamp: number;
}

const pendingRequests = new Map<string, PendingRequest>();
const REQUEST_DEBOUNCE_MS = 300; // 300ms debounce for duplicate requests
const MAX_PENDING_AGE = 5000; // Cancel requests older than 5 seconds

// Generate a unique key for each request
const getRequestKey = (config: InternalAxiosRequestConfig): string => {
  const method = config.method?.toUpperCase() || 'GET';
  const url = config.url || '';
  const params = config.params ? JSON.stringify(config.params) : '';
  const data = config.data ? (typeof config.data === 'string' ? config.data : JSON.stringify(config.data)) : '';
  return `${method}:${url}:${params}:${data}`;
};

// Clean up old pending requests
const cleanupOldRequests = () => {
  const now = Date.now();
  for (const [key, request] of pendingRequests.entries()) {
    if (now - request.timestamp > MAX_PENDING_AGE) {
      request.cancel();
      pendingRequests.delete(key);
    }
  }
};

// Request interceptor - Add authentication token and prevent duplicate requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authService.getToken();
    
    if (token && config.headers) {
      config.headers['x-access-token'] = token;
    }
    
    // If FormData is being sent, remove Content-Type header to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers?.['Content-Type'];
    }
    
    // Skip duplicate prevention for file uploads and certain endpoints
    const skipDuplicateCheck = 
      config.url?.includes('/upload') || 
      config.url?.includes('/stream') ||
      config.url?.includes('/notifications') ||
      config.data instanceof FormData;
    
    if (!skipDuplicateCheck) {
      const requestKey = getRequestKey(config);
      const existingRequest = pendingRequests.get(requestKey);
      
      // If same request exists and is recent, cancel it
      if (existingRequest) {
        const timeSinceRequest = Date.now() - existingRequest.timestamp;
        if (timeSinceRequest < REQUEST_DEBOUNCE_MS) {
          console.log(`🚫 Cancelling duplicate request: ${requestKey}`);
          existingRequest.cancel();
          pendingRequests.delete(requestKey);
        }
      }
      
      // Create abort controller for this request (only if not already set)
      let abortController: AbortController | null = null;
      if (!config.signal) {
        abortController = new AbortController();
        config.signal = abortController.signal;
      }
      
      // Store this request (only if we created an abort controller)
      if (abortController) {
        pendingRequests.set(requestKey, {
          url: config.url || '',
          method: config.method?.toUpperCase() || 'GET',
          cancel: () => abortController!.abort(),
          timestamp: Date.now()
        });
      }
      
      // Clean up old requests periodically
      cleanupOldRequests();
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally and clean up request queue
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Remove request from pending queue on success
    const config = response.config as InternalAxiosRequestConfig;
    const requestKey = getRequestKey(config);
    pendingRequests.delete(requestKey);
    
    // Return the data directly for successful responses
    return response;
  },
  (error: AxiosError) => {
    // Remove request from pending queue on error
    if (error.config) {
      const requestKey = getRequestKey(error.config as InternalAxiosRequestConfig);
      pendingRequests.delete(requestKey);
    }
    
    // Handle 401 Unauthorized - Automatic logout
    if (error.response?.status === 401) {
      // Clear authentication data
      authService.logout();
      
      // Redirect to login page
      window.location.href = '/login';
      
      // Return a rejected promise with a clear message
      return Promise.reject(new Error('Session expired. Please login again.'));
    }

    // Handle 429 Too Many Requests - Rate limiting
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      const message = retryAfter 
        ? `Too many requests. Please try again after ${retryAfter} seconds.`
        : 'Too many requests. Please wait a moment before trying again.';
      
      return Promise.reject(new Error(message));
    }

    // Handle other HTTP errors
    if (error.response) {
      // Server responded with error status
      const message = (error.response.data as any)?.message || error.message;
      
      // Check for rate limit message in response
      if (message && (message.toLowerCase().includes('too many requests') || message.toLowerCase().includes('rate limit'))) {
        return Promise.reject(new Error('Too many requests. Please wait a moment before trying again.'));
      }
      
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject(new Error('No response from server. Please check your connection.'));
    } else {
      // Something else happened (including AbortError)
      if (error.name === 'AbortError' || error.message?.includes('aborted')) {
        return Promise.reject(new Error('Request was cancelled'));
      }
      return Promise.reject(error);
    }
  }
);

export default api;

