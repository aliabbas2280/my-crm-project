import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from './constants/index';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard/Dashboard';
import AppNavbar from './components/Layout/Navbar';
import ClientsPage from './Pages/ClientsPage';
import DealsPage from './Pages/DealsPage';

import SettingsPage from './Pages/SettingsPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CSS/Dashboard.css';
import './App.css';

function App() {
  const location = useLocation();
  const showNavbar = ![ROUTES.LOGIN, ROUTES.SIGNUP].includes(location.pathname);

  return (
    <>
      {showNavbar && <AppNavbar />}
      <Routes>
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<Signup />} />
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.CLIENTS} element={<ClientsPage />} />
        <Route path={ROUTES.DEALS} element={<DealsPage />} />
        <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
      </Routes>
    </>
  );
}

export default App;