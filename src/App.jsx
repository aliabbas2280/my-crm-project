import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './constants/index';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard/Dashboard';
import ClientsPage from './Pages/ClientsPage';
import DealsPage from './Pages/DealsPage';
import SettingsPage from './Pages/SettingsPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CSS/Dashboard.css';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.SIGNUP} element={<Signup />} />
      <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path={ROUTES.CLIENTS} element={<ProtectedRoute><ClientsPage /></ProtectedRoute>} />
      <Route path={ROUTES.DEALS} element={<ProtectedRoute><DealsPage /></ProtectedRoute>} />
      <Route path={ROUTES.SETTINGS} element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;