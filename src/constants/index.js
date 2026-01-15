
const API_BASE = 'http://localhost:5000';

export const API_ENDPOINTS = {
  USERS: `${API_BASE}/users`,
  CLIENTS: `${API_BASE}/clients`,
  DEALS: `${API_BASE}/deals`,
  ACTIVITIES: `${API_BASE}/activities`,
  DASHBOARD: `${API_BASE}/dashboard`
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  CLIENTS: '/clients',
  DEALS: '/deals',
  SETTINGS: '/settings'
};
