import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'user');

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
      localStorage.setItem('userRole', user.role || 'user');
      setToken(token);
      setUser(user);
      setUserRole(user.role || 'user');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { success: true, role: user.role || 'user' };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  };

  const signup = async (name, email, password, role = 'user') => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, { name, email, password, role });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role || role);
      setToken(token);
      setUser(user);
      setUserRole(user.role || role);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { success: true, role: user.role || role };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setToken(null);
    setUser(null);
    setUserRole('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, userRole, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};