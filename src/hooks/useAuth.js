import { useState } from 'react';
import { usersAPI } from '../utils/api';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await usersAPI.login(email, password);
      const user = response.data;

      // Save user to localStorage (avoid storing password in real apps)
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        })
      );

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
      // Fetch all users
      const { data: users } = await usersAPI.getAll();

      // Check if email already exists
      const existingUser = users.find(u => u.email === formData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'user'
      };

      const createdUser = await usersAPI.create(newUser);
      return { success: true, user: createdUser };
    } catch (error) {
      throw new Error(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
  };

  const getCurrentUser = () => {
    const userData = localStorage.getItem('currentUser');

    if (!userData || userData === 'undefined') return null;

    try {
      return JSON.parse(userData);
    } catch {
      localStorage.removeItem('currentUser');
      return null;
    }
  };

  return { login, signup, logout, getCurrentUser, loading };
};
