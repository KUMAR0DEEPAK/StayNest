import { createContext, useState, useEffect } from 'react';
import api from '../services/api.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Restore session on page load (now uses just user object)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // 2. Login Handler
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: userData, token } = response.data;

      // Save user profile state & token fallback to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      if (token) {
        localStorage.setItem('token', token);
      }

      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed. Please try again.'
      };
    }
  };

  // 3. Register Handler
  const register = async (fullName, email, password, phone, role) => {
    try {
      const response = await api.post('/auth/register', {
        full_name: fullName,
        email,
        password,
        phone,
        role
      });
      const { user: userData, token } = response.data;

      // Save user profile state & token fallback to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      if (token) {
        localStorage.setItem('token', token);
      }

      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed.'
      };
    }
  };

  // 4. Logout Handler
  const logout = async () => {
    try {
      await api.post('/auth/logout'); // Call backend to clear HTTP-Only cookie
    } catch (error) {
      console.error('Error logging out from server:', error);
    } finally {
      // Always clear client-side state
      localStorage.removeItem('user');
      localStorage.removeItem('token'); // Clears any legacy tokens
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
