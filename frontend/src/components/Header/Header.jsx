import React from 'react';
import { FiSearch, FiBell, FiHelpCircle } from "react-icons/fi";
import './Header.scss';

// Thêm props searchTerm và onSearchChange
const Header = ({ searchTerm, onSearchChange }) => {
  return (
    <header className="top-header">
      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input 
          type="text" 
          placeholder="Tìm theo Tên, Email, Số điện thoại, ID..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)} // Bắt sự kiện khi gõ phím
        />
      </div>
      <div className="user-profile">
        <FiBell className="icon notification-icon" />
        <FiHelpCircle className="icon help-icon" />
        <div className="divider"></div>
        <img src="https://i.pravatar.cc/150?img=12" alt="Admin" className="admin-avatar" />
        <span className="admin-name">Admin User</span>
      </div>
    </header>
  );
};

export default Header;