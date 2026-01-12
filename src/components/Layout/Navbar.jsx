import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdDashboard, MdPeople, MdHandshake, MdPerson, MdLogout, MdSettings, MdNotifications } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { ROUTES } from '../../constants/index';
import './Navbar.css';

const navLinks = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: MdDashboard },
  { path: ROUTES.CLIENTS, label: 'Clients', icon: MdPeople },
  { path: ROUTES.DEALS, label: 'Deals', icon: MdHandshake },
];

const AppNavbar = ({ sidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user && user !== 'undefined') {
      try {
        setCurrentUser(JSON.parse(user));
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate(ROUTES.LOGIN);
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
          >
            <Icon className="nav-icon" />
            <span className="nav-label">{label}</span>
          </div>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            <MdPerson />
          </div>
          <div className="user-details">
            <div className="user-name">{currentUser?.name || 'User'}</div>
            <div className="user-role">{currentUser?.role || 'Sales'}</div>
          </div>
        </div>
        <div className="sidebar-actions">
          <MdSettings 
            className="action-icon" 
            onClick={() => navigate(ROUTES.SETTINGS)}
            title="Settings"
          />
          <MdLogout 
            className="action-icon" 
            onClick={handleLogout}
            title="Logout"
          />
        </div>
      </div>
    </div>
  );
};

export default AppNavbar;
