import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize user from localStorage
    const savedAuth = localStorage.getItem('hilearn_auth');
    if (savedAuth) {
      try {
        const userData = JSON.parse(savedAuth);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved auth data:', error);
        localStorage.removeItem('hilearn_auth');
        localStorage.removeItem('hilearn_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save to localStorage
      localStorage.setItem('hilearn_auth', JSON.stringify(data.data));
      localStorage.setItem('hilearn_token', data.data.token);

      // Set user state
      setUser(data.data);

      return data.data.role;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Save to localStorage
      localStorage.setItem('hilearn_auth', JSON.stringify(data.data));
      localStorage.setItem('hilearn_token', data.data.token);

      // Set user state
      setUser(data.data);

      return data.data.role;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('hilearn_auth');
    localStorage.removeItem('hilearn_token');
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
