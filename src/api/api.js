import axios from 'axios';
import { API_ROUTES } from '../utils/apiRoutes';

// Use REACT_APP_BACKEND_URL when provided. If not set, default to Spring Boot's
// common default port (8080) so local development works without extra config.
// If your backend runs on a different port, set REACT_APP_BACKEND_URL in an
// .env.local file (e.g. REACT_APP_BACKEND_URL=http://localhost:5000).
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';
const REFRESH_STORAGE_KEY = process.env.REACT_APP_REFRESH_STORAGE_KEY || 'broq_refresh_token';

let authContextRef = null;
let isRefreshing = false;
let refreshPromise = null;

// Function to set auth context reference
export const setAuthContext = (context) => {
  authContextRef = context;
};

// Create axios instance
const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach access token
api.interceptors.request.use(
  (config) => {
    if (authContextRef) {
      const accessToken = authContextRef.getAccessToken();
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Check if refresh token exists
      const refreshToken = localStorage.getItem(REFRESH_STORAGE_KEY);
      
      if (!refreshToken) {
        // No refresh token, logout and redirect
        if (authContextRef) {
          authContextRef.logout();
        }
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // If refresh is already in progress, wait for it
      if (!isRefreshing) {
        isRefreshing = true;
        
        refreshPromise = authContextRef
          .refresh()
          .then((newAccessToken) => {
            return newAccessToken;
          })
          .catch((refreshError) => {
            // Refresh failed, logout
            if (authContextRef) {
              authContextRef.logout();
            }
            window.location.href = '/login';
            throw refreshError;
          })
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });
      }

      try {
        const newAccessToken = await refreshPromise;
        
        // Retry original request with new token
        if (newAccessToken) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
