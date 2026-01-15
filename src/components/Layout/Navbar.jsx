import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdDashboard, MdPeople, MdHandshake, MdPerson, MdLogout, MdSettings, MdClose } from 'react-icons/md';
import { ROUTES } from '../../constants/index';
import './Navbar.css';

const navLinks = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: MdDashboard },
  { path: ROUTES.CLIENTS, label: 'Clients', icon: MdPeople },
  { path: ROUTES.DEALS, label: 'Deals', icon: MdHandshake },
];

const AppNavbar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState({ name: 'User', role: 'Sales' });

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user && user !== 'undefined') {
      try {
        setCurrentUser(JSON.parse(user));
      } catch (error) {
        localStorage.removeItem('currentUser');
        setCurrentUser({ name: 'User', role: 'Sales' });
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate(ROUTES.LOGIN);
  };

  const handleSettings = () => {
    navigate(ROUTES.SETTINGS);
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className={`modern-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand-logo">
          <div className="logo-icon">📊</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navLinks.map(({ path, label, icon: Icon }) => (
          <div
            key={path}
            onClick={() => navigate(path)}
            className={`nav-item ${isActive(path) ? 'active' : ''}`}
            title={label}
          >
            <Icon className="nav-icon" />
            <span className="nav-label">{label}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar"><MdPerson /></div>
          <div className="user-details">
            <div className="user-name">{currentUser?.name}</div>
            <div className="user-role">{currentUser?.role}</div>
          </div>
        </div>
        <div className="sidebar-actions">
          <button
            className="action-icon-btn"
            onClick={handleSettings}
            aria-label="Settings"
            title="Settings"
          >
            <MdSettings className="action-icon" />
          </button>
          <button
            className="action-icon-btn"
            onClick={handleLogout}
            aria-label="Logout"
            title="Logout"
          >
            <MdLogout className="action-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppNavbar;
