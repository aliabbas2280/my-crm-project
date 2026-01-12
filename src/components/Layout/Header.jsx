import { MdSearch } from 'react-icons/md';

const Header = ({ title, subtitle, currentUser, onSearch, searchValue }) => {
  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (onSearch) {
      onSearch(value); 
    }
  };

  return (
    <div className="main-header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
        <p className="header-subtitle">
          Hello {currentUser?.name || 'User'} , {subtitle}
        </p>
      </div>
      
      <div className="header-actions">
        <div className="header-search">
          <MdSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search deals & activities..." 
            value={searchValue || ''} 
            onChange={handleSearchChange} 
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
