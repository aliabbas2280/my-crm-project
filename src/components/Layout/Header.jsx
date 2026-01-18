import { MdSearch } from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';

const Header = ({ title, subtitle, onSearch, searchValue, showSearch = true }) => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (onSearch) {
      onSearch(value); 
    }
  };

  return (
    <div className="main-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">{title}</h1>
          <p className="header-subtitle">
            Hello {user?.name || 'User'} , {subtitle}
          </p>
        </div>
        
        {showSearch && (
          <div className="header-search">
            <MdSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search deals & activities..." 
              value={searchValue || ''} 
              onChange={handleSearchChange} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
