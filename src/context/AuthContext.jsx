import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../utils/apiRoutes';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const REFRESH_STORAGE_KEY = process.env.REACT_APP_REFRESH_STORAGE_KEY || 'broq_refresh_token';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    accessToken: null,
    username: null,
    email: null,
    role: null,
    isAuthenticated: false,
  });

  const [isInitializing, setIsInitializing] = useState(true);

  // Login function - stores refreshToken to localStorage, rest to context
  const login = useCallback((authData) => {
    const { accessToken, refreshToken, username, email, role } = authData;
    
    // Store refresh token in localStorage
    if (refreshToken) {
      localStorage.setItem(REFRESH_STORAGE_KEY, refreshToken);
    }
    
    // Store everything else in context (memory)
    setAuth({
      accessToken,
      username,
      email,
      role,
      isAuthenticated: true,
    });
  }, []);

  // Logout function - clears everything
  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_STORAGE_KEY);
    
    // Call backend logout if refresh token exists
    if (refreshToken) {
      try {
        await axios.post(`${BACKEND_URL}${API_ROUTES.LOGOUT}`, { refreshToken });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    // Clear local storage
    localStorage.removeItem(REFRESH_STORAGE_KEY);
    
    // Clear context
    setAuth({
      accessToken: null,
      username: null,
      email: null,
      role: null,
      isAuthenticated: false,
    });
  }, []);

  // Refresh function - gets new tokens using refreshToken
  const refresh = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_STORAGE_KEY);
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${BACKEND_URL}${API_ROUTES.REFRESH_TOKEN}`, {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken, username, email, role } = response.data;

      // Update refresh token in localStorage
      if (newRefreshToken) {
        localStorage.setItem(REFRESH_STORAGE_KEY, newRefreshToken);
      }

      // Update context
      setAuth({
        accessToken,
        username,
        email,
        role,
        isAuthenticated: true,
      });

      return accessToken;
    } catch (error) {
      // If refresh fails, logout
      localStorage.removeItem(REFRESH_STORAGE_KEY);
      setAuth({
        accessToken: null,
        username: null,
        email: null,
        role: null,
        isAuthenticated: false,
      });
      throw error;
    }
  }, []);

  // Get current access token
  const getAccessToken = useCallback(() => {
    return auth.accessToken;
  }, [auth.accessToken]);

  // Initialize auth on mount - try to restore session
  useEffect(() => {
    const initAuth = async () => {
      const refreshToken = localStorage.getItem(REFRESH_STORAGE_KEY);
      
      if (refreshToken) {
        try {
          await refresh();
        } catch (error) {
          console.error('Failed to restore session:', error);
        }
      }
      
      setIsInitializing(false);
    };

    initAuth();
  }, [refresh]);

  const value = {
    auth,
    login,
    logout,
    refresh,
    getAccessToken,
    isInitializing,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
