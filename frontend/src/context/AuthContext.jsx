import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get('/products/auth/check/');
      if (response.data.authenticated) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.post('/products/auth/login/', {
        username,
        password,
      });
      setUser(response.data.user);
      setIsAuthenticated(true);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/products/auth/register/', userData);
      setUser(response.data.user);
      setIsAuthenticated(true);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        errors: error.response?.data || { error: 'Registration failed' },
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/products/auth/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await api.put('/products/auth/profile/', userData);
      setUser(response.data.user);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        errors: error.response?.data || { error: 'Update failed' },
      };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
