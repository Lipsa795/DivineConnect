import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Show welcome notification after login
      setTimeout(() => {
        if (window.showNotification) {
          window.showNotification(
            "🙏 Welcome to DivineConnect!",
            `Namaste ${user.name}! May your spiritual journey be blessed.`,
            "welcome",
            "/"
          );
        }
      }, 2000);
      
      // Show offer notification after 6 seconds
      setTimeout(() => {
        if (window.showNotification) {
          window.showNotification(
            "🛕 Special Pooja Offer!",
            "Get 20% off on all pooja bookings this week. Use code: BLESSINGS20",
            "offer",
            "/pooja-booking"
          );
        }
      }, 6000);
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, { name, email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Show welcome notification after signup
      setTimeout(() => {
        if (window.showNotification) {
          window.showNotification(
            "🙏 Welcome to DivineConnect!",
            `Namaste ${user.name}! Thank you for joining our spiritual community.`,
            "welcome",
            "/"
          );
        }
      }, 2000);
      
      // Show offer notification after 6 seconds
      setTimeout(() => {
        if (window.showNotification) {
          window.showNotification(
            "🛕 Special Welcome Offer!",
            "Get 20% off on your first pooja booking. Use code: WELCOME20",
            "offer",
            "/pooja-booking"
          );
        }
      }, 6000);
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};