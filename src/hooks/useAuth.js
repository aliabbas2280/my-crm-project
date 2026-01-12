import { useState } from 'react';
import { usersAPI } from '../utils/api';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await usersAPI.login(email, password);
      const user = response.data;
      
      localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }));
      
      return { success: true, user };
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    setLoading(true);
    try {
      
      const response = await usersAPI.getAll();
      const users = response.data || response; 
      
      const existingUser = users.find(u => u.email === formData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      const newUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'user'
      };
      
      const createResponse = await usersAPI.create(newUser);
      return { success: true, user: createResponse };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
  };

  const getCurrentUser = () => {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  };

  return { login, signup, logout, getCurrentUser, loading };
};